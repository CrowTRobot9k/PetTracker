using PetTracker.Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public interface IPetService
    {
        Task<int> CreatePet(AddPetDto pet);
        Task<int> UpdatePet(AddPetDto pet);
        Task<int> DeletePet(int petId);
        Task<List<GetPetDto>> GetPets(int? ownerId = null);
        Task<List<PetDto>> GetPetList(int? ownerId = null);
        Task<List<PetTypeDto>> GetPetTypes();
        Task<List<BreedTypeDto>> GetPetBreeds(int petTypeId);
        Task<List<FileDownloadDto>> GetPetPhotos(int petId);
        Task<Dictionary<int, List<FileDownloadDto>>> GetPetPhotosBatch(List<int> petIds);
    }
}
