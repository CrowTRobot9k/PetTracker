using Microsoft.Extensions.Logging;
using PetTracker.SqlDb.Models;


using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
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
    }
}
