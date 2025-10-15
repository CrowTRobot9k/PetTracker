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
        private readonly ICachingService _cachingService;
        private readonly IPayloadSizeService _payloadSizeService;

        public PetController(ILogger<PetController> logger, IPtDbContext dbContext, IPetService petService, ICachingService cachingService, IPayloadSizeService payloadSizeService) : base(logger,dbContext)
        {
            _PetService = petService;
            _cachingService = cachingService;
            _payloadSizeService = payloadSizeService;
        }
        [HttpGet("GetPets")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPets(int? ownerId)
        {
            var result = await _PetService.GetPets(ownerId);
            return new JsonResult(result);
        }

        [HttpGet("GetPetList")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPetList(int? ownerId)
        {
            var result = await _PetService.GetPetList(ownerId);
            return new JsonResult(result);
        }

        [HttpPost("CreatePet")]
        [Authorize(Roles = "Administrator,Pets Write")]
        public async Task<IActionResult> CreatePet([FromForm] AddPetDto model)
        {
            var result = await _PetService.CreatePet(model);
            return new JsonResult(true);
        }


        [HttpPost("UpdatePet")]
        [Authorize(Roles = "Administrator,Pets Write")]
        public async Task<IActionResult> UpdatePet([FromForm] AddPetDto model)
        {
            var result = await _PetService.UpdatePet(model);
            return new JsonResult(true);
        }

        [HttpPost("DeletePet")]
        [Authorize(Roles = "Administrator,Pets Write")]
        public async Task<IActionResult> DeletePet([FromBody]int id)
        {
            var result = await _PetService.DeletePet(id);
            return new JsonResult(true);
        }

        [HttpGet("GetPetTypes")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPetTypes()
        {
            return new JsonResult(await _PetService.GetPetTypes());
        }

        [HttpGet("GetPetBreeds")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPetBreeds(int petTypeId)
        {
            // Create cache key based on petTypeId parameter
            var cacheKey = $"pet_breeds_{petTypeId}";
            
            // Try to get from cache first
            var cachedResult = await _cachingService.GetAsync<object>(cacheKey);
            if (cachedResult != null)
            {
                return new JsonResult(cachedResult);
            }
            
            // If not in cache, fetch from database
            var result = await _PetService.GetPetBreeds(petTypeId);
            
            // Cache the result for 1 hour (breeds don't change frequently)
            await _cachingService.SetAsync(cacheKey, result, TimeSpan.FromHours(1));
            
            return new JsonResult(result);
        }

        [HttpGet("GetPetPhotos")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPetPhotos(int petId)
        {
            var result = await _PetService.GetPetPhotos(petId);
            
            // Add payload size information to response headers
            var payloadSize = _payloadSizeService.CalculatePayloadSize(result);
            Response.Headers.Append("X-Payload-Size-Bytes", payloadSize.ToString());
            Response.Headers.Append("X-Payload-Size-KB", (payloadSize / 1024).ToString());
            Response.Headers.Append("X-Photo-Count", result.Count.ToString());
            
            return new JsonResult(result);
        }

        [HttpPost("GetPetPhotosBatch")]
        [Authorize(Roles = "Administrator,Pets Read,Pets Write")]
        public async Task<IActionResult> GetPetPhotosBatch([FromBody] List<int> petIds)
        {
            var result = await _PetService.GetPetPhotosBatch(petIds);
            return new JsonResult(result);
        }
    }
}
