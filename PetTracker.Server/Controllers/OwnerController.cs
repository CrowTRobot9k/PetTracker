using Microsoft.AspNetCore.Mvc;
using PetTracker.Domain.DTOs;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class OwnerController : PetTrackerBaseController
    {
        private readonly IOwnerService _OwnerService;
        public OwnerController(ILogger<OwnerController> logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
            _OwnerService = new OwnerService(logger, dbContext);
        }

        [HttpGet("GetOwners")]
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

        [HttpPost("CreateOwner")]
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

        [HttpGet("GetStates")]
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
