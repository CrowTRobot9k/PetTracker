using Microsoft.AspNetCore.Mvc;
using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using PetTracker.Infrastucture;
using PetTracker.Server.Models;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class PetController : PetTrackerBaseController
    {
        private readonly PetService _PetService;

        public PetController(ILogger<PetController> logger, IPtDbContext dbContext) : base(logger,dbContext)
        {
            _PetService = new PetService(logger, dbContext);
        }
        [HttpGet("GetPets")]
        public async Task<string> GetPets()
        {
            try
            {
                return "Test";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting the weather forecast.");
                throw;
            }
        }

        [HttpGet("GetPet")]
        public async Task<string> GetPet()
        {
            try
            {
                return "Test";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting the weather forecast.");
                throw;
            }
        }

        [HttpPost("CreatePet")]
        public async Task<bool> CreatePet(AddPetDto model)
        {
            try
            {
                var result = await _PetService.CreatePet(model);
            }
            catch (Exception ex)
            {
                HandleUIException(ex, model);
            }

            return true;
        }
    }
}
