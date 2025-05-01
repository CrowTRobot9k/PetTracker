using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class PetDto
    {
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
