using PetTracker.Domain.DTOs;

namespace PetTracker.Infrastucture.Services
{
    public interface IOwnerService
    {
        Task<int> CreateOwner(AddOwnerDto owner);
        Task<int> UpdateOwner(AddOwnerDto owner);
        Task<List<GetOwnerDto>> GetOwners(int? companyId = null);
        Task<List<OwnerDto>> GetOwnerList(int? companyId = null);
        Task<List<FileDownloadDto>> GetOwnerPhotos(int ownerId);
        Task<Dictionary<int, List<FileDownloadDto>>> GetOwnerPhotosBatch(List<int> ownerIds);
        Task<bool> AddExistingPetsToOwner(AddExistingPetsToOwnerDto model);
        Task<bool> RemoveExistingPetsToOwner(AddExistingPetsToOwnerDto model);
    }
}
