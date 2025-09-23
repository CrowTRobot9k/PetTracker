using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using PetTracker.Infrastucture.Utilities;
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
        private readonly ICustomEmailSender _emailSender;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(ILogger<UserService> logger, IPtDbContext dbContext, UserManager<AspNetUser> userManager, RoleManager<AspNetRole> roleManager, IFileUploadService fileUploadService, ICustomEmailSender emailSender, IHttpContextAccessor httpContextAccessor) : base(logger, dbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _fileUploadService = fileUploadService;
            _emailSender = emailSender;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<GetUserDto>> GetUsers(int? companyId = null)
        {
            try
            {
                _logger.LogInformation("GetUsers method called");
                
                var query = _dbContext.AspNetUsers
                    .AsNoTracking()
                    .Include(u => u.Company)
                    .AsQueryable();
                
                // Filter by company if specified
                if (companyId.HasValue)
                {
                    query = query.Where(u => u.CompanyId == companyId.Value);
                }
                
                var users = await query.ToListAsync();
                
                // Get roles for each user using UserManager
                var userDtos = new List<GetUserDto>();
                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    var roleEntities = await _roleManager.Roles
                        .Where(r => roles.Contains(r.Name!))
                        .ToListAsync();
                    
                    user.Roles = roleEntities;
                    
                    var dto = new GetUserDto(user);
                    dto.UserPhotos = new List<FileDownloadDto>(); // Override to exclude file uploads
                    userDtos.Add(dto);
                }
                
                _logger.LogInformation($"Retrieved {users.Count} users from database with roles");
                
                return userDtos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetUsers method");
                throw;
            }
        }

        public async Task<GetUserDto?> GetUserById(string userId)
        {
            try
            {
                _logger.LogInformation($"GetUserById method called for userId: {userId}");
                
                var user = await _dbContext.AspNetUsers
                    .AsNoTracking()
                    .Include(u => u.Company)
                    .FirstOrDefaultAsync(u => u.Id == userId);
                
                if (user == null)
                {
                    _logger.LogWarning($"User with ID {userId} not found");
                    return null;
                }
                
                // Get roles for the user using UserManager
                var roles = await _userManager.GetRolesAsync(user);
                var roleEntities = await _roleManager.Roles
                    .Where(r => roles.Contains(r.Name!))
                    .ToListAsync();
                
                user.Roles = roleEntities;
                
                var dto = new GetUserDto(user);
                dto.UserPhotos = new List<FileDownloadDto>(); // Override to exclude file uploads
                
                _logger.LogInformation($"Retrieved user {user.Email} with {roles.Count} roles");
                
                return dto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetUserById method for userId: {userId}");
                throw;
            }
        }


        public async Task<List<RoleDto>> GetRoles()
        {
            try
            {
                _logger.LogInformation("GetRoles method called - using RoleManager");
                
                var roles = await _roleManager.Roles
                    .AsNoTracking()
                    .ToListAsync();
                
                _logger.LogInformation($"Retrieved {roles.Count} roles from database");
                
                return roles.Select(r => new RoleDto(r)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetRoles method");
                throw;
            }
        }

        public async Task<List<RoleDto>> GetUserRoles(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return new List<RoleDto>();
                }

                var roles = await _userManager.GetRolesAsync(user);
                var roleEntities = await _roleManager.Roles
                    .Where(r => roles.Contains(r.Name!))
                    .ToListAsync();

                return roleEntities.Select(r => new RoleDto(r)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetUserRoles method");
                throw;
            }
        }

        public async Task<string> CreateUser(AddUserDto userDto, string? currentUserId = null)
        {
            try
            {
                // Get current user's roles for authorization
                var currentUserRoles = new List<string>();
                if (!string.IsNullOrEmpty(currentUserId))
                {
                    var currentUser = await _userManager.FindByIdAsync(currentUserId);
                    if (currentUser != null)
                    {
                        currentUserRoles = (await _userManager.GetRolesAsync(currentUser)).ToList();
                    }
                }

                // Validate role assignments based on new permission model
                if (userDto.Roles?.Any() == true)
                {
                    var requestedRoleNames = userDto.Roles.Select(r => r.Name).Where(name => !string.IsNullOrEmpty(name)).ToList();
                    
                    // If current user has no roles, they cannot assign any roles
                    if (!currentUserRoles.Any() && requestedRoleNames.Any())
                    {
                        throw new UnauthorizedAccessException("You do not have permission to assign roles to users.");
                    }
                    
                    // Check if user can assign each requested role
                    var unauthorizedRoles = requestedRoleNames.Where(roleName => !CanAssignRole(roleName, currentUserRoles)).ToList();
                    if (unauthorizedRoles.Any())
                    {
                        throw new UnauthorizedAccessException($"You do not have permission to assign the following roles: {string.Join(", ", unauthorizedRoles)}");
                    }
                }

                // Create new user
                var user = new AspNetUser
                {
                    UserName = userDto.Email, // Use email as username
                    Email = userDto.Email,
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    CompanyId = userDto.Company?.Id,
                    MustChangePassword = true
                };

                // Generate a temporary password
                var tempPassword = PasswordGenerator.GenerateTemporaryPassword();
                
                // Create the user
                var result = await _userManager.CreateAsync(user, tempPassword);
                
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to create user: {errors}");
                }

                // Assign roles (already validated above)
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

                // Generate email confirmation link using the same approach as IdentityApiEndpointRouteBuilderExtensions
                var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailConfirmationToken));

                // Create a simple confirmation link that matches the frontend route
                var context = _httpContextAccessor.HttpContext;
                if (context != null)
                {
                    var baseUrl = $"{context.Request.Scheme}://{context.Request.Host}";
                    var confirmationLink = $"{baseUrl}/confirm-email?userId={user.Id}&code={encodedToken}";
                    
                    // Send email with temporary password and confirmation link
                    try
                    {
                        await _emailSender.SendTemporaryPasswordAsync(user, user.Email, tempPassword, confirmationLink);
                        _logger.LogInformation($"Temporary password email sent to {user.Email}");
                    }
                    catch (Exception emailEx)
                    {
                        _logger.LogError(emailEx, $"Failed to send temporary password email to {user.Email}");
                        // Don't throw here - user creation succeeded, email failure is logged
                    }
                }
                else
                {
                    _logger.LogWarning($"HttpContext is null, cannot generate confirmation link for user {user.Email}");
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

        private bool CanAssignRole(string roleName, List<string> currentUserRoles)
        {
            // If user is Administrator, they can assign any role
            if (currentUserRoles.Contains("Administrator"))
            {
                return true;
            }
            
            // If user has write access to a resource, they can assign read access to the same resource
            if (roleName.EndsWith(" Read"))
            {
                var resourceName = roleName.Replace(" Read", "");
                var writeRoleName = $"{resourceName} Write";
                return currentUserRoles.Contains(writeRoleName);
            }
            
            // Otherwise, user cannot assign this role
            return false;
        }

        public async Task<string> UpdateUser(AddUserDto userDto, string? currentUserId = null)
        {
            try
            {
                // Get current user's roles for authorization
                var currentUserRoles = new List<string>();
                if (!string.IsNullOrEmpty(currentUserId))
                {
                    var currentUser = await _userManager.FindByIdAsync(currentUserId);
                    if (currentUser != null)
                    {
                        currentUserRoles = (await _userManager.GetRolesAsync(currentUser)).ToList();
                    }
                }

                // Find the user to update
                var user = await _userManager.FindByIdAsync(userDto.Id);
                if (user == null)
                {
                    throw new KeyNotFoundException($"User with ID {userDto.Id} not found.");
                }

                // Validate role assignments based on new permission model
                if (userDto.Roles?.Any() == true)
                {
                    var requestedRoleNames = userDto.Roles.Select(r => r.Name).Where(name => !string.IsNullOrEmpty(name)).ToList();
                    
                    // If current user has no roles, they cannot assign any roles
                    if (!currentUserRoles.Any() && requestedRoleNames.Any())
                    {
                        throw new UnauthorizedAccessException("You do not have permission to assign roles to users.");
                    }
                    
                    // Check if user can assign each requested role
                    var unauthorizedRoles = requestedRoleNames.Where(roleName => !CanAssignRole(roleName, currentUserRoles)).ToList();
                    if (unauthorizedRoles.Any())
                    {
                        throw new UnauthorizedAccessException($"You do not have permission to assign the following roles: {string.Join(", ", unauthorizedRoles)}");
                    }
                }

                // Update user properties (excluding email)
                user.FirstName = userDto.FirstName;
                user.LastName = userDto.LastName;
                user.UserName = userDto.UserName;
                user.CompanyId = userDto.Company?.Id;

                // Update the user
                var result = await _userManager.UpdateAsync(user);
                
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to update user: {errors}");
                }

                // Update roles (already validated above)
                if (userDto.Roles?.Any() == true)
                {
                    // Remove existing roles
                    var existingRoles = await _userManager.GetRolesAsync(user);
                    if (existingRoles.Any())
                    {
                        await _userManager.RemoveFromRolesAsync(user, existingRoles);
                    }

                    // Add new roles
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

                _logger.LogInformation($"Successfully updated user: {user.Email} with ID: {user.Id}");
                return user.Id;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user: {userDto.Email}");
                throw;
            }
        }
    }
}
