using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class AddPetDto
    {
        public List<IFormFile> PetPhotos { get; set; } = new List<IFormFile>();
        public string? Name { get; set; }
        public int PetTypeId { get; set; }
        public string? PetType { get; set; }
        public List<int> BreedTypeIds { get; set; } = new List<int>();
        public string? Color { get; set; }
        public DateTime? BirthDate { get; set; }
        public double? Weight { get; set; }
        public string Sex { get; set; } = string.Empty;
        public string? MedicalProblems { get; set; }
    }
}
