using Microsoft.AspNetCore.Authorization;
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

        public PetController(ILogger<PetController> logger, IPtDbContext dbContext, IPetService petService) : base(logger,dbContext)
        {
            _PetService = petService;
        }
        [HttpGet("GetPets")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
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

        [HttpGet("GetPetList")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPetList(int? ownerId)
        {
            try
            {
                var result = await _PetService.GetPetList(ownerId);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, ownerId));
            }
        }

        [HttpPost("CreatePet")]
        [Authorize(Roles = "Administrator,Pets Write")]
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
        [Authorize(Roles = "Administrator,Pets Write")]
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

        [HttpPost("DeletePet")]
        [Authorize(Roles = "Administrator,Pets Write")]
        public async Task<IActionResult> DeletePet([FromBody]int id)
        {
            try
            {
                var result = await _PetService.DeletePet(id);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, id));
            }

            return new JsonResult(true);
        }

        [HttpGet("GetPetTypes")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
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
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
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

        [HttpGet("GetPetPhotos")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPetPhotos(int petId)
        {
            try
            {
                var result = await _PetService.GetPetPhotos(petId);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }

        [HttpPost("GetPetPhotosBatch")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPetPhotosBatch([FromBody] List<int> petIds)
        {
            try
            {
                var result = await _PetService.GetPetPhotosBatch(petIds);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }
    }
}
