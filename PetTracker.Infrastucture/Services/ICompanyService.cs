using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public interface ICompanyService
    {
        public Task<List<Company>> GetCompanies(int? companyId = null);
    }
}
