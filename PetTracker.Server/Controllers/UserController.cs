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
        private readonly ICachingService _cachingService;
        
        public UserController(ILogger<OwnerController> logger, IPtDbContext dbContext, IUserService userService, ICachingService cachingService) : base(logger, dbContext)
        {
            _UserService = userService;
            _cachingService = cachingService;
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
                
                // Clear roles cache since new user might have roles
                await _cachingService.RemoveAsync("roles_all");
                
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
                const string cacheKey = "roles_all";
                
                // Try to get from cache first
                var cachedResult = await _cachingService.GetAsync<object>(cacheKey);
                if (cachedResult != null)
                {
                    return new JsonResult(cachedResult);
                }
                
                // If not in cache, fetch from database
                var result = await _UserService.GetRoles();
                
                // Cache the result for 2 hours (roles don't change frequently)
                await _cachingService.SetAsync(cacheKey, result, TimeSpan.FromHours(2));
                
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
                
                // Clear roles cache since user roles might have changed
                await _cachingService.RemoveAsync("roles_all");
                
                return new JsonResult(new { success = true, userId = result });
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }
        }
    }
}
