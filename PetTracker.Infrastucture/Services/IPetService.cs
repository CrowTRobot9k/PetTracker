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
        Task<List<PetTypeDto>> GetPetTypes();
        Task<List<BreedTypeDto>> GetPetBreeds(int petTypeId);
    }
}
