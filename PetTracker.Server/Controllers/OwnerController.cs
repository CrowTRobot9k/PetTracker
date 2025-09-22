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
        public OwnerController(ILogger<OwnerController> logger, IPtDbContext dbContext, IOwnerService ownerService) : base(logger, dbContext)
        {
            _OwnerService = ownerService;
        }

        [HttpGet("GetOwners")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetOwners()
        {
            try
            {
                var result = await _OwnerService.GetOwners();
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }

        [HttpGet("GetOwnerList")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetOwnerList()
        {
            try
            {
                var result = await _OwnerService.GetOwnerList();
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }

        [HttpPost("CreateOwner")]
        [Authorize(Roles = "Administrator,Owners Write")]
        public async Task<IActionResult> CreateOwner([FromForm] AddOwnerDto model)

        {
            try
            {
                var result = await _OwnerService.CreateOwner(model);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }

            return new JsonResult(true);
        }

        [HttpPost("UpdateOwner")]
        [Authorize(Roles = "Administrator,Owners Write")]
        public async Task<IActionResult> UpdateOwner([FromForm] AddOwnerDto model)
        {
            try
            {
                var result = await _OwnerService.UpdateOwner(model);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }

            return new JsonResult(true);
        }

        [HttpPost("AddExistingPetsToOwner")]
        [Authorize(Roles = "Administrator,Owners Write")]
        public async Task<IActionResult> AddExistingPetsToOwner(AddExistingPetsToOwnerDto model)
        {
            try
            {
                var result = await _OwnerService.AddExistingPetsToOwner(model);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }

            return new JsonResult(true);
        }

        [HttpPost("RemoveExistingPetFromOwner")]
        [Authorize(Roles = "Administrator,Owners Write")]
        public async Task<IActionResult> RemoveExistingPetFromOwner(AddExistingPetsToOwnerDto model)
        {
            try
            {
                var result = await _OwnerService.RemoveExistingPetsToOwner(model);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }

            return new JsonResult(true);
        }

        [HttpGet("GetOwnerPhotos")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetOwnerPhotos(int ownerId)
        {
            try
            {
                var result = await _OwnerService.GetOwnerPhotos(ownerId);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }

        [HttpPost("GetOwnerPhotosBatch")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetOwnerPhotosBatch([FromBody] List<int> ownerIds)
        {
            try
            {
                var result = await _OwnerService.GetOwnerPhotosBatch(ownerIds);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }

        [HttpGet("GetStates")]
        [Authorize(Roles = "Administrator,Owners Read,Owners Write")]
        public async Task<IActionResult> GetStates()
        {
            var ret = new List<USState>();
            try
            {
               ret = USState.GetStates();
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }

            return new JsonResult(ret);
        }
    }
}
