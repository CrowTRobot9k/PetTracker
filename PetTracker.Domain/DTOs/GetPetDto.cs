using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class GetPetDto :PetDto
    {
        public GetPetDto(Pet pet):base(pet)
        {
            
            PetType = new PetTypeDto(pet.PetType);
            BreedTypes = pet.PetBreedTypes.Select(s => new BreedTypeDto(s.BreedType)).ToList();
            PetPhotos = pet.FileUploadMappings.Select(s => new FileUploadDto(s.FileUpload)).ToList();
        }
        public PetTypeDto PetType { get; set; } = new PetTypeDto();
        public List<BreedTypeDto> BreedTypes { get; set; } = new List<BreedTypeDto>();
        public List<FileUploadDto> PetPhotos { get; set; } = new List<FileUploadDto>();
    }
}
