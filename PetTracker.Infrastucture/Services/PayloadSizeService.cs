using Microsoft.Extensions.Logging;
using PetTracker.Domain.DTOs;
using System.Text;
using System.Text.Json;

namespace PetTracker.Infrastucture.Services
{
    public class PayloadSizeService : IPayloadSizeService
    {
        private readonly ILogger<PayloadSizeService> _logger;

        public PayloadSizeService(ILogger<PayloadSizeService> logger)
        {
            _logger = logger;
        }

        public bool ValidatePayloadSize<T>(List<T> data, int maxSizeKB = 300)
        {
            var payloadSize = CalculatePayloadSize(data);
            var maxSizeBytes = maxSizeKB * 1024;
            
            _logger.LogInformation($"Payload size: {payloadSize} bytes, Max allowed: {maxSizeBytes} bytes");
            
            return payloadSize <= maxSizeBytes;
        }

        public int CalculatePayloadSize<T>(List<T> data)
        {
            if (data == null || !data.Any())
                return 0;

            try
            {
                var json = JsonSerializer.Serialize(data);
                var bytes = Encoding.UTF8.GetBytes(json);
                return bytes.Length;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating payload size");
                return 0;
            }
        }

        public List<FileDownloadDto> LimitPhotosToSize(List<FileDownloadDto> photos, int maxSizeKB = 300)
        {
            if (photos == null || !photos.Any())
                return new List<FileDownloadDto>();

            var maxSizeBytes = maxSizeKB * 1024;
            var limitedPhotos = new List<FileDownloadDto>();
            var currentSize = 0;

            // Sort photos by size (smallest first) to include as many as possible
            var sortedPhotos = photos.OrderBy(p => p.FileDataBase64?.Length ?? 0).ToList();

            foreach (var photo in sortedPhotos)
            {
                var photoSize = CalculatePhotoSize(photo);
                
                // If adding this photo would exceed the limit, stop
                if (currentSize + photoSize > maxSizeBytes)
                {
                    _logger.LogWarning($"Stopping photo inclusion at {limitedPhotos.Count} photos to stay under {maxSizeKB}KB limit");
                    break;
                }

                limitedPhotos.Add(photo);
                currentSize += photoSize;
            }

            _logger.LogInformation($"Limited photos to {limitedPhotos.Count} out of {photos.Count} to stay under {maxSizeKB}KB limit");
            return limitedPhotos;
        }

        private int CalculatePhotoSize(FileDownloadDto photo)
        {
            if (photo == null)
                return 0;

            try
            {
                var json = JsonSerializer.Serialize(photo);
                return Encoding.UTF8.GetBytes(json).Length;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating photo size");
                return 0;
            }
        }
    }
}
