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
        public async Task<int> UpdatePet(AddPetDto pet)
        {
            var uploadIds = new List<int>();
            if (pet.PetPhotos.Any())
            {
                uploadIds = await new FileUploadService(_logger, _dbContext).CreateFileUploads(pet.PetPhotos);
            }

            var existingPet = await _dbContext.Pets.FirstOrDefaultAsync(p => p.Id == pet.Id);
            if (existingPet == null)
            {
                throw new Exception("Pet not found");
            }

            existingPet.UpdatePet(pet);

            var tasks = new List<Task>();

            var fileMappings = new List<FileUploadMapping>();
            if (uploadIds.Any())
            {
                _dbContext.FileUploadMappings.RemoveRange(existingPet.FileUploadMappings);
                _dbContext.FileUploads.RemoveRange(existingPet.FileUploadMappings.Select(s => s.FileUpload));
                fileMappings = uploadIds.Select(s => new FileUploadMapping()
                {
                    PetId = existingPet.Id,
                    FileUploadId = s
                }).ToList();

                tasks.Add(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings));
            }


            if (existingPet.PetBreedTypes?.Any() ?? false &&
                !pet.BreedTypeIds.All(b => existingPet.PetBreedTypes.Select(s => s.BreedType.Id).Contains(b)))
            {
                //add non existing breed types
                var breedTypes = pet.BreedTypeIds.Where(x => !existingPet.PetBreedTypes.Select(s => s.BreedTypeId).Contains(x)).Select(s => new PetBreedType()
                {
                    PetId = existingPet.Id,
                    BreedTypeId = s
                });
                //remove breed types not sent for save
                _dbContext.PetBreedTypes.RemoveRange(existingPet.PetBreedTypes.Where(w => !pet.BreedTypeIds.Contains(w.BreedTypeId)));

                if (breedTypes.Any())
                {
                    tasks.Add(_dbContext.PetBreedTypes.AddRangeAsync(breedTypes));
                }
            }

            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
            }

            existingPet.UpdatePet(pet);

            await _dbContext.SaveChangesAsync();

            return existingPet.Id;
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
    }
}
