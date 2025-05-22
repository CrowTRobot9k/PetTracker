using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using PetTracker.SqlDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public class OwnerService : ServiceBase, IOwnerService
    {
        public OwnerService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }
        public async Task<int> CreateOwner(AddOwnerDto owner)
        {
            var uploadIds = new List<int>();
            if (owner.OwnerPhotos.Any())
            {
                uploadIds = await new FileUploadService(_logger, _dbContext).CreateFileUploads(owner.OwnerPhotos);
            }

            var addOwner = new Owner(owner);

            await _dbContext.Owners.AddAsync(addOwner);
            await _dbContext.SaveChangesAsync();

            var tasks = new List<Task>();

            var fileMappings = new List<FileUploadMapping>();
            if (uploadIds.Any())
            {
                fileMappings = fileMappings = uploadIds.Select(s => new FileUploadMapping()
                {
                    OwnerId = addOwner.Id,
                    FileUploadId = s
                }).ToList();

                tasks.Add(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings));
            }

            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
            }

            await _dbContext.SaveChangesAsync();

            return addOwner.Id;
        }
        public async Task<int> UpdateOwner(AddOwnerDto owner)
        {
            var uploadIds = new List<int>();
            if (owner.OwnerPhotos.Any())
            {
                uploadIds = await new FileUploadService(_logger, _dbContext).CreateFileUploads(owner.OwnerPhotos);
            }

            var existingOwner = await _dbContext.Owners.FirstOrDefaultAsync(p => p.Id == owner.Id);
            if (existingOwner == null)
            {
                throw new Exception("Owner not found");
            }

            existingOwner.UpdateOwner(owner);

            var tasks = new List<Task>();

            var fileMappings = new List<FileUploadMapping>();
            if (uploadIds.Any())
            {
                _dbContext.FileUploadMappings.RemoveRange(existingOwner.FileUploadMappings);
                _dbContext.FileUploads.RemoveRange(existingOwner.FileUploadMappings.Select(s => s.FileUpload));
                fileMappings = uploadIds.Select(s => new FileUploadMapping()
                {
                    OwnerId = existingOwner.Id,
                    FileUploadId = s
                }).ToList();

                tasks.Add(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings));
            }

            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
            }

            existingOwner.UpdateOwner(owner);

            await _dbContext.SaveChangesAsync();

            return existingOwner.Id;
        }
        public async Task<List<GetOwnerDto>> GetOwners(int? companyId = null)
        {
            var results = await _dbContext.Owners
                .Where(w => companyId == null || (w.User != null && w.User.CompanyId == companyId))
                .ToListAsync();
            if (results == null || !results.Any())
            { 
                return new List<GetOwnerDto>();
            }

            return results.Select(s => new GetOwnerDto(s)).ToList();
        }

        public async Task<bool> AddExistingPetsToOwner(AddExistingPetsToOwnerDto model)
        { 
            var existingPets = _dbContext.Pets
                .Where(w => model.PetIds.Contains(w.Id))
                .ToList();

            if (existingPets == null || !existingPets.Any())
            {
                return false;
            }

            existingPets.ForEach(f =>
            {
                f.OwnerId = model.OwnerId;
            });

            _dbContext.Pets.UpdateRange(existingPets);

            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}
