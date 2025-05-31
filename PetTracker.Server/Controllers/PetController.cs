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
        private readonly IPetService _PetService;

        public PetController(ILogger<PetController> logger, IPtDbContext dbContext) : base(logger,dbContext)
        {
            _PetService = new PetService(logger, dbContext);
        }
        [HttpGet("GetPets")]
        public async Task<IActionResult> GetPets(int? ownerId)
        {
            try
            {
               var result = await _PetService.GetPets(ownerId);
               return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, ownerId));
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
        public async Task<IActionResult> CreatePet([FromForm] AddPetDto model)
        {
            try
            {
                var result = await _PetService.CreatePet(model);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }

            return new JsonResult(true);
        }


        [HttpPost("UpdatePet")]
        public async Task<IActionResult> UpdatePet([FromForm] AddPetDto model)
        {
            try
            {
                var result = await _PetService.UpdatePet(model);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex,model));
            }

            return new JsonResult(true);
        }

        [HttpGet("GetPetTypes")]
        public async Task<IActionResult> GetPetTypes()
        {
            try
            {
                return new JsonResult(await _PetService.GetPetTypes());
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }

        [HttpGet("GetPetBreeds")]
        public async Task<IActionResult> GetPetBreeds(int petTypeId)
        {
            try
            {
                return new JsonResult(await _PetService.GetPetBreeds(petTypeId));
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }
    }
}
