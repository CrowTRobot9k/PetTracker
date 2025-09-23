using PetTracker.Domain.DTOs;

namespace PetTracker.Infrastucture.Services
{
    public interface IPayloadSizeService
    {
        bool ValidatePayloadSize<T>(List<T> data, int maxSizeKB = 300);
        int CalculatePayloadSize<T>(List<T> data);
        List<FileDownloadDto> LimitPhotosToSize(List<FileDownloadDto> photos, int maxSizeKB = 300);
    }
}
