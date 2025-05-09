using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class OwnerDto
    {
        public OwnerDto()
        {
        }
        public OwnerDto(Models.Owner owner)
        {
            Id = owner.Id;
            FirstName = owner.FirstName;
            LastName = owner.LastName;
            Address = owner.Address;
            City = owner.City;
            State = owner.State;
            ZipCode = owner.ZipCode;
            Email = owner.Email;
            Phone = owner.Phone;
            ReferredBy = owner.ReferredBy;
            Vet = owner.Vet;
            VetPhone = owner.VetPhone;
        }

        public int Id { get; set; }
        public string? UserId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public string ZipCode { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string ReferredBy { get; set; } = null!;
        public string Vet { get; set; } = null!;
        public string VetPhone { get; set; } = null!;
    }
}
