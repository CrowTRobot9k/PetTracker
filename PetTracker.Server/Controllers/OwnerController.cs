using Microsoft.AspNetCore.Mvc;
using PetTracker.Domain.DTOs;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OwnerController : PetTrackerBaseController
    {
        private readonly OwnerService _OwnerService;
        public OwnerController(ILogger<OwnerController> logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
            _OwnerService = new OwnerService(logger, dbContext);
        }

        [HttpPost("CreatePet")]
        public async Task<bool> CreatePet([FromForm] AddPetDto model)

        {
            try
            {
                //var result = await _OwnerService.CreatePet(model);
            }
            catch (Exception ex)
            {
                HandleUIException(ex, model);
            }

            return true;
        }
    }
}
