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
    public class UserService : ServiceBase, IUserService
    {
        public UserService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<List<AspNetUser>> GetUsers(int? companyId = null)
        {
            return await _dbContext.AspNetUsers
                .Where(w => companyId == null || (w.Company != null && w.Company.Id == companyId)).ToListAsync();
        }
    }
}
