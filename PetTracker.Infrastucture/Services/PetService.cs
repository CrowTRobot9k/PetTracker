using Microsoft.Extensions.Logging;
using PetTracker.SqlDb.Models;


using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
namespace PetTracker.Infrastucture.Services
{
    public class PetService : ServiceBase, IPetService
    {
        public PetService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<int> CreatePet(AddPetDto pet)
        {
            var uploadIds = await new FileUploadService(_logger, _dbContext).CreateFileUploads(pet.PetPhotos);

            var addPet = new Pet(pet);

            await _dbContext.Pets.AddAsync(addPet);
            await _dbContext.SaveChangesAsync();

            var fileMappings = uploadIds.Select(s => new FileUploadMapping()
            { 
                PetId = addPet.Id,
                FileUploadId = s
            });

            var breedTypes = pet.BreedTypeIds.Select(s => new PetBreedType()
            {
                PetId = addPet.Id,
                BreedTypeId = s
            });

            await Task.WhenAll(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings), _dbContext.PetBreedTypes.AddRangeAsync(breedTypes));
            await _dbContext.SaveChangesAsync();

            return addPet.Id;
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
