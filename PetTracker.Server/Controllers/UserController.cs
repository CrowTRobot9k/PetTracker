using Microsoft.AspNetCore.Mvc;
using PetTracker.Domain.DTOs;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class UserController : PetTrackerBaseController
    {
        private readonly IUserService _UserService;
        public UserController(ILogger<OwnerController> logger, IPtDbContext dbContext, IUserService userService) : base(logger, dbContext)
        {
            _UserService = userService;
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

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser([FromForm] AddUserDto model)
        {
            try
            {
                //var result = await _UserService.GetUsers();
                return new JsonResult(true);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }

        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var result = await _UserService.GetRoles();
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }
    }
}
