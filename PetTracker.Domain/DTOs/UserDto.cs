using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class UserDto
    {
        public UserDto()
        {

        }
        public UserDto(AspNetUser user)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            UserName = user.UserName;
            Email = user.Email;
            Company = user.Company != null ? new CompanyDto(user.Company) : null;
            Roles = user.Roles?.Select(r => new RoleDto(r)).ToList() ?? new List<RoleDto>();
        }
        public string Id { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName => $"{FirstName} {LastName}"?.Trim();
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public CompanyDto? Company { get; set; }
        public List<RoleDto> Roles { get; set; } = new List<RoleDto>();
    }
}
