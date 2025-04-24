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
        public List<FileModel> PetPhotos { get; set; } = new List<FileModel>();
        public string? Name { get; set; }
        public List<int> BreedTypeIds { get; set; } = new List<int>();
        public string? PetColor { get; set; }
        public DateTime? BirthDate { get; set; }
        public double? Weight { get; set; }
        public string PetSex { get; set; } = string.Empty;
        public int PetTypeId { get; set; }
        public string? PetMedicalProblems { get; set; }
    }
}
