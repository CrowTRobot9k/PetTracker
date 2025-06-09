using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetTracker.Domain.Models;
using PetTracker.SqlDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public class CompanyService : ServiceBase, ICompanyService
    {
        public CompanyService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<List<Company>> GetCompanies(int? companyId)
        {
            return await _dbContext.Companies
                .Where(w => companyId == null || w.Id == companyId)
                .ToListAsync();
        }
    }
}
