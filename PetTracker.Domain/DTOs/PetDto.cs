using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class PetDto
    {
        public PetDto()
        {
        }
        public PetDto(Pet pet)
        {
            Id = pet.Id;
            OwnerId = pet.OwnerId;
            Name = pet.Name;
            Color = pet.Color;
            BirthDate = pet.BirthDate;
            Weight = pet.Weight;
            Sex = pet.Sex;
            MedicalProblems = pet.MedicalProblems;
        }
        public int Id { get; set; }
        public int? OwnerId { get; set; }
        public string? Name { get; set; }
        public int PetTypeId { get; set; }
        public string? PetType { get; set; }
        public List<int> BreedTypeIds { get; set; } = new List<int>();
        public string? Color { get; set; }
        public DateTime? BirthDate { get; set; }
        public double? Weight { get; set; }
        public string? Sex { get; set; }
        public string? MedicalProblems { get; set; }
    }
}
