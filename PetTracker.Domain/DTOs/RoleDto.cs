using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class RoleDto
    {
        public RoleDto()
        {
        }
        public RoleDto(AspNetRole role)
        {
            Id = role.Id;
            Name = role.Name;
            NormalizedName = role.NormalizedName;
            ConcurrencyStamp = role.ConcurrencyStamp;
        }
        public string Id { get; set; } = null!;
        public string? Name { get; set; }
        public string? NormalizedName { get; set; }
        public string? ConcurrencyStamp { get; set; }

    }
}
