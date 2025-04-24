using Microsoft.Extensions.Logging;
using PetTracker.SqlDb.Models;


using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
namespace PetTracker.Infrastucture
{
    public class PetService : ServiceBase
    {
        public PetService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<bool> CreatePet(AddPetDto pet)
        {
            try
            {
                var addPet = new Pet
                {
                    Name = pet.Name,
                    //PetColor = pet.PetColor,
                    //BirthDate = pet.BirthDate,
                    //Weight = pet.Weight,
                    //PetSex = pet.PetSex,
                    //PetMedicalProblems = pet.PetMedicalProblems,
                    PetTypeId = pet.PetTypeId
                };
                await _dbContext.Pets.AddAsync(addPet);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a pet.");
                return false;
            }
        }
    }
}
