using Microsoft.Extensions.Logging;
using PetTracker.SqlDb.Models;


using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
namespace PetTracker.Infrastucture.Services
{
    public class PetService : ServiceBase, IPetService
    {
        public PetService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<int> CreatePet(AddPetDto pet)
        {
            var uploadIds = new List<int>();
            if (pet.PetPhotos.Any())
            {
                uploadIds = await new FileUploadService(_logger, _dbContext).CreateFileUploads(pet.PetPhotos);
            }

            var addPet = new Pet(pet);

            await _dbContext.Pets.AddAsync(addPet);
            await _dbContext.SaveChangesAsync();

            var tasks = new List<Task>();

            var fileMappings = new List<FileUploadMapping>();
            if (uploadIds.Any())
            {
                fileMappings = fileMappings = uploadIds.Select(s => new FileUploadMapping()
                {
                    PetId = addPet.Id,
                    FileUploadId = s
                }).ToList();

                tasks.Add(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings));
            }


            if (pet.BreedTypeIds?.Any() ?? false)
            {
                var breedTypes = pet.BreedTypeIds.Select(s => new PetBreedType()
                {
                    PetId = addPet.Id,
                    BreedTypeId = s
                });

                tasks.Add(_dbContext.PetBreedTypes.AddRangeAsync(breedTypes));
            }

            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
            }

            await _dbContext.SaveChangesAsync();

            return addPet.Id;
        }

        public async Task<int> UpdatePet(AddPetDto pet)
        {
            var uploadIds = new List<int>();
            if (pet.PetPhotos.Any())
            {
                uploadIds = await new FileUploadService(_logger, _dbContext).CreateFileUploads(pet.PetPhotos);
            }

            var existingPet = await _dbContext.Pets.FirstOrDefaultAsync(p=>p.Id==pet.Id);
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


            if (existingPet.PetBreedTypes?.Any()??false &&
                !pet.BreedTypeIds.All(b=> existingPet.PetBreedTypes.Select(s=>s.BreedType.Id).Contains(b)))
            {
                //add non existing breed types
                var breedTypes = pet.BreedTypeIds.Where(x=> !existingPet.PetBreedTypes.Select(s=>s.BreedTypeId).Contains(x)).Select(s => new PetBreedType()
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

        public async Task<List<GetPetDto>> GetPets(int? ownerId = null)
        {
            var results = await _dbContext.Pets.Where(w => ownerId == null || w.OwnerId == ownerId).ToListAsync();
            return results.Select(s => new GetPetDto(s)).ToList();
        }

        public async Task<List<PetTypeDto>> GetPetTypes()
        {
            try
            {
                var petTypes = await _dbContext.PetTypes.ToListAsync();
                return petTypes.Select(s=>new PetTypeDto(s)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting pet types.");
                return new List<PetTypeDto>();
            }
        }
        public async Task<List<BreedTypeDto>> GetPetBreeds(int petTypeId)
        {
            try
            {
                var petTypes = await _dbContext.BreedTypes.Where(i=>i.PetTypeId == petTypeId).ToListAsync();
                return petTypes.Select(s => new BreedTypeDto(s)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting breed types.");
                return new List<BreedTypeDto>();
            }
        }
    }
}
