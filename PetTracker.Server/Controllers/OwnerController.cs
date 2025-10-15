using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetTracker.Domain.DTOs;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class OwnerController : PetTrackerBaseController
    {
        private readonly IOwnerService _OwnerService;
        private readonly IPayloadSizeService _payloadSizeService;
        
        public OwnerController(ILogger<OwnerController> logger, IPtDbContext dbContext, IOwnerService ownerService, IPayloadSizeService payloadSizeService) : base(logger, dbContext)
        {
            _OwnerService = ownerService;
            _payloadSizeService = payloadSizeService;
        }

        [HttpGet("GetOwners")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetOwners()
        {
            var result = await _OwnerService.GetOwners();
            return new JsonResult(result);
        }

        [HttpGet("GetOwnerList")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetOwnerList()
        {
            var result = await _OwnerService.GetOwnerList();
            return new JsonResult(result);
        }

        [HttpPost("CreateOwner")]
        [Authorize(Roles = "Administrator,Owners Write")]
        public async Task<IActionResult> CreateOwner([FromForm] AddOwnerDto model)
        {
            var result = await _OwnerService.CreateOwner(model);
            return new JsonResult(true);
        }

        [HttpPost("UpdateOwner")]
        [Authorize(Roles = "Administrator,Owners Write")]
        public async Task<IActionResult> UpdateOwner([FromForm] AddOwnerDto model)
        {
            var result = await _OwnerService.UpdateOwner(model);
            return new JsonResult(true);
        }

        [HttpPost("AddExistingPetsToOwner")]
        [Authorize(Roles = "Administrator,Owners Write")]
        public async Task<IActionResult> AddExistingPetsToOwner(AddExistingPetsToOwnerDto model)
        {
            var result = await _OwnerService.AddExistingPetsToOwner(model);
            return new JsonResult(true);
        }

        [HttpPost("RemoveExistingPetFromOwner")]
        [Authorize(Roles = "Administrator,Owners Write")]
        public async Task<IActionResult> RemoveExistingPetFromOwner(AddExistingPetsToOwnerDto model)
        {
            var result = await _OwnerService.RemoveExistingPetsToOwner(model);
            return new JsonResult(true);
        }

        [HttpGet("GetOwnerPhotos")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetOwnerPhotos(int ownerId)
        {
            var result = await _OwnerService.GetOwnerPhotos(ownerId);
            
            // Add payload size information to response headers
            var payloadSize = _payloadSizeService.CalculatePayloadSize(result);
            Response.Headers.Append("X-Payload-Size-Bytes", payloadSize.ToString());
            Response.Headers.Append("X-Payload-Size-KB", (payloadSize / 1024).ToString());
            Response.Headers.Append("X-Photo-Count", result.Count.ToString());
            
            return new JsonResult(result);
        }

        [HttpPost("GetOwnerPhotosBatch")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetOwnerPhotosBatch([FromBody] List<int> ownerIds)
        {
            var result = await _OwnerService.GetOwnerPhotosBatch(ownerIds);
            return new JsonResult(result);
        }

        [HttpGet("GetStates")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetStates()
        {
            var ret = USState.GetStates();
            return new JsonResult(ret);
        }
    }
}
