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
        public UserService(ILogger<UserService> logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<List<GetUserDto>> GetUsers(int? companyId = null)
        {
            //var result = await _dbContext
            //    .Where(w => companyId == null || (w.Company != null && w.Company.Id == companyId)).ToListAsync();

            //return result.Select(w => new GetUserDto(w)).ToList();
            return new List<GetUserDto>();
        }

        public async Task<List<RoleDto>> GetRoles()
        {
            //var roles = await _dbContext.AspNetRoles.ToListAsync();
            //return roles.Select(r => new RoleDto(r)).ToList();
            return new List<RoleDto>();
        }
    }
}
