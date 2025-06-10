using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public interface IUserService
    {
        Task<List<GetUserDto>> GetUsers(int? companyId = null);
        Task<List<RoleDto>> GetRoles();
    }
}
