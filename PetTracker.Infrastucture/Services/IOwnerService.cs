using PetTracker.Domain.DTOs;

namespace PetTracker.Infrastucture.Services
{
    public interface IOwnerService
    {
        Task<int> CreateOwner(AddOwnerDto owner);
        Task<int> UpdateOwner(AddOwnerDto owner);
        Task<List<GetOwnerDto>> GetOwners(int? companyId = null);
        Task<bool> AddExistingPetsToOwner(AddExistingPetsToOwnerDto model);
    }
}
