using Microsoft.AspNetCore.Mvc;
using PetTracker.Domain.DTOs;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class OwnerController : PetTrackerBaseController
    {
        private readonly OwnerService _OwnerService;
        public OwnerController(ILogger<OwnerController> logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
            _OwnerService = new OwnerService(logger, dbContext);
        }

        [HttpGet("GetOwners")]
        public async Task<IEnumerable<GetOwnerDto>> GetOwners()
        {
            try
            {
                var result = await _OwnerService.GetOwners();
                return result;
            }
            catch (Exception ex)
            {
                HandleUIException(ex);
            }
            return new List<GetOwnerDto>();
        }

        [HttpPost("CreateOwner")]
        public async Task<bool> CreateOwner([FromForm] AddOwnerDto model)

        {
            try
            {
                var result = await _OwnerService.CreateOwner(model);
            }
            catch (Exception ex)
            {
                HandleUIException(ex, model);
            }

            return true;
        }

        [HttpPost("UpdateOwner")]
        public async Task<bool> UpdateOwner([FromForm] AddOwnerDto model)

        {
            try
            {
                var result = await _OwnerService.UpdateOwner(model);
            }
            catch (Exception ex)
            {
                HandleUIException(ex, model);
            }

            return true;
        }

        [HttpGet("GetStates")]
        public async Task<List<USState>> GetStates()
        {
            var ret = new List<USState>();
            try
            {
               ret = USState.GetStates();
            }
            catch (Exception ex)
            {
                HandleUIException(ex);
            }

            return ret;
        }
    }
}
