using Microsoft.AspNetCore.Mvc;
using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using PetTracker.Infrastucture.Services;
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
        public async Task<List<GetPetDto>> GetPets(int? ownerId)
        {
            try
            {
               var result = await _PetService.GetPets(ownerId);
               return result;
            }
            catch (Exception ex)
            {
                HandleUIException(ex);
            }
            return new List<GetPetDto>();
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
        public async Task<bool> CreatePet([FromForm] AddPetDto model)

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


        [HttpPost("UpdatePet")]
        public async Task<bool> UpdatePet([FromForm] AddPetDto model)

        {
            try
            {
                var result = await _PetService.UpdatePet(model);
            }
            catch (Exception ex)
            {
                HandleUIException(ex, model);
            }

            return true;
        }

        [HttpGet("GetPetTypes")]
        public async Task<List<PetTypeDto>> GetPetTypes()
        {
            try
            {
                return await _PetService.GetPetTypes();
            }
            catch (Exception ex)
            {
                HandleUIException(ex);
            }
            return new List<PetTypeDto>();
        }

        [HttpGet("GetPetBreeds")]
        public async Task<List<BreedTypeDto>> GetPetBreeds(int petTypeId)
        {
            try
            {
                return await _PetService.GetPetBreeds(petTypeId);
            }
            catch (Exception ex)
            {
                HandleUIException(ex);
            }
            return new List<BreedTypeDto>();
        }
    }
}
