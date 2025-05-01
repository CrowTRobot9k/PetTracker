using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class GetPetDto :PetDto
    {
        public PetTypeDto PetType { get; set; } = new PetTypeDto();
        public List<BreedTypeDto> BreedTypes { get; set; } = new List<BreedTypeDto>();
        public List<FileUploadDto> PetPhotos { get; set; } = new List<FileUploadDto>();
    }
}
