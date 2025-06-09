using Microsoft.AspNetCore.Mvc;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class UserController : PetTrackerBaseController
    {
        private readonly IUserService _UserService;
        public UserController(ILogger<OwnerController> logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
            _UserService = new UserService(logger, dbContext);
        }

        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var result = await _UserService.GetUsers();
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }
    }
}
