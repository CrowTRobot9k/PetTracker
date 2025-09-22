using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using PetTracker.Domain.DTOs;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;
using System.Security.Claims;

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
        [Authorize(Roles = "Administrator,Users Read,Users Write")]
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
        [Authorize(Roles = "Administrator,Users Write")]
        public async Task<IActionResult> CreateUser([FromForm] AddUserDto model)
        {
            try
            {
                // Get current user ID from claims
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var result = await _UserService.CreateUser(model, currentUserId);
                return new JsonResult(new { success = true, userId = result });
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }
        }

        [HttpGet("GetRoles")]
        [Authorize(Roles = "Administrator,Users Read,Users Write")]
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

        [HttpPost("UpdateUser")]
        [Authorize(Roles = "Administrator,Users Write")]
        public async Task<IActionResult> UpdateUser([FromForm] AddUserDto model)
        {
            try
            {
                // Get current user ID from claims
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var result = await _UserService.UpdateUser(model, currentUserId);
                return new JsonResult(new { success = true, userId = result });
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }
        }
    }
}
