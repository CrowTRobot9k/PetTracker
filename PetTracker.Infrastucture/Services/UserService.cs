using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using PetTracker.SqlDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public class UserService : ServiceBase<UserService>, IUserService
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly RoleManager<AspNetRole> _roleManager;
        private readonly IFileUploadService _fileUploadService;

        public UserService(ILogger<UserService> logger, IPtDbContext dbContext, UserManager<AspNetUser> userManager, RoleManager<AspNetRole> roleManager, IFileUploadService fileUploadService) : base(logger, dbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _fileUploadService = fileUploadService;
        }

        public async Task<List<GetUserDto>> GetUsers(int? companyId = null)
        {
            try
            {
                _logger.LogInformation("GetUsers method called");

                var query = _dbContext.AspNetUsers.AsQueryable();

                // Filter by company if specified
                if (companyId.HasValue)
                {
                    query = query.Where(u => u.CompanyId == companyId.Value);
                }

                var users = await query.ToListAsync();

                _logger.LogInformation($"Retrieved {users.Count} users from database");

                return users.Select(u => new GetUserDto(u)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetUsers method");
                throw;
            }
        }

        public async Task<List<RoleDto>> GetRoles()
        {
            // Use Identity's RoleManager to get roles
            var roles = _roleManager.Roles.ToList();
            return roles.Select(r => new RoleDto(r)).ToList();
        }

        public async Task<string> CreateUser(AddUserDto userDto)
        {
            try
            {
                // Create new user
                var user = new AspNetUser
                {
                    UserName = userDto.Email, // Use email as username
                    Email = userDto.Email,
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    CompanyId = userDto.Company?.Id
                };

                // Generate a temporary password - in a real app, you'd send this via email
                var tempPassword = "TempPassword123!";
                
                // Create the user
                var result = await _userManager.CreateAsync(user, tempPassword);
                
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to create user: {errors}");
                }

                // Assign roles
                if (userDto.Roles?.Any() == true)
                {
                    var roleNames = userDto.Roles.Select(r => r.Name).Where(name => !string.IsNullOrEmpty(name)).ToArray();
                    if (roleNames.Any())
                    {
                        var roleResult = await _userManager.AddToRolesAsync(user, roleNames);
                        if (!roleResult.Succeeded)
                        {
                            var roleErrors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                            _logger.LogWarning($"Failed to assign roles to user {user.Email}: {roleErrors}");
                        }
                    }
                }

                // Handle file uploads
                if (userDto.UserPhotos?.Any() == true)
                {
                    var uploadTasks = userDto.UserPhotos.Select(async photo =>
                    {
                        try
                        {
                            var uploadId = await _fileUploadService.CreateFileUpload(photo);
                            if (uploadId > 0)
                            {
                                // Create file upload mapping for the user
                                var mapping = new FileUploadMapping
                                {
                                    AspNetUserId = user.Id,
                                    FileUploadId = uploadId
                                };
                                _dbContext.FileUploadMappings.Add(mapping);
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, $"Failed to upload photo for user {user.Email}");
                        }
                    });

                    await Task.WhenAll(uploadTasks);
                }

                await _dbContext.SaveChangesAsync();

                _logger.LogInformation($"Successfully created user: {user.Email} with ID: {user.Id}");
                return user.Id;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating user: {userDto.Email}");
                throw;
            }
        }
    }
}
