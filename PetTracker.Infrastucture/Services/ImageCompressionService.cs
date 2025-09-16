using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using Microsoft.Extensions.Logging;

namespace PetTracker.Infrastucture.Services
{
    public interface IImageCompressionService
    {
        Task<byte[]> CompressImageAsync(byte[] imageData, int maxSizeKB = 200);
    }

    public class ImageCompressionService : IImageCompressionService
    {
        private readonly ILogger<ImageCompressionService> _logger;
        private const int MaxSizeBytes = 200 * 1024; // 200KB in bytes

        public ImageCompressionService(ILogger<ImageCompressionService> logger)
        {
            _logger = logger;
        }

        public async Task<byte[]> CompressImageAsync(byte[] imageData, int maxSizeKB = 200)
        {
            if (imageData == null || imageData.Length == 0)
            {
                return imageData;
            }

            var maxSizeBytes = maxSizeKB * 1024;

            // If image is already small enough, return as is
            if (imageData.Length <= maxSizeBytes)
            {
                _logger.LogInformation($"Image is already {imageData.Length} bytes, no compression needed");
                return imageData;
            }

            try
            {
                using var image = Image.Load(imageData);
                var originalSize = imageData.Length;
                _logger.LogInformation($"Compressing image from {originalSize} bytes to target {maxSizeBytes} bytes");

                // Start with quality 85 and adjust down if needed
                int quality = 85;
                byte[] compressedData = null;
                int maxAttempts = 10; // Prevent infinite loops
                int attemptCount = 0;
                bool hasResized = false;

                do
                {
                    attemptCount++;
                    
                    // Safety check to prevent infinite loops
                    if (attemptCount > maxAttempts)
                    {
                        _logger.LogWarning($"Maximum compression attempts ({maxAttempts}) reached. Using best result so far.");
                        break;
                    }

                    using var outputStream = new MemoryStream();
                    
                    // Configure JPEG encoder with current quality
                    var encoder = new JpegEncoder
                    {
                        Quality = Math.Max(quality, 10) // Ensure minimum quality of 10
                    };

                    // Save with current quality
                    await image.SaveAsync(outputStream, encoder);
                    compressedData = outputStream.ToArray();

                    _logger.LogInformation($"Compression attempt {attemptCount}: Quality {quality}, Size {compressedData.Length} bytes");

                    // If we achieved the target size, break
                    if (compressedData.Length <= maxSizeBytes)
                    {
                        break;
                    }

                    // Reduce quality for next attempt
                    quality -= 15; // Larger steps to avoid getting stuck

                    // If quality gets too low and we haven't resized yet, try resizing the image
                    if (quality < 25 && !hasResized)
                    {
                        _logger.LogInformation("Quality too low, attempting to resize image");
                        
                        // Calculate resize factor based on current size vs target
                        var resizeFactor = Math.Sqrt((double)maxSizeBytes / compressedData.Length);
                        var newWidth = (int)(image.Width * resizeFactor);
                        var newHeight = (int)(image.Height * resizeFactor);

                        // Ensure minimum dimensions
                        newWidth = Math.Max(newWidth, 100);
                        newHeight = Math.Max(newHeight, 100);

                        // Ensure we're actually making the image smaller
                        if (newWidth >= image.Width && newHeight >= image.Height)
                        {
                            _logger.LogWarning("Resize would not reduce image size, skipping resize");
                            hasResized = true; // Mark as attempted to avoid retry
                            continue;
                        }

                        _logger.LogInformation($"Resizing image from {image.Width}x{image.Height} to {newWidth}x{newHeight}");

                        // Clone and resize the image
                        using var resizedImage = image.CloneAs<Rgba32>();
                        resizedImage.Mutate(x => x.Resize(newWidth, newHeight));

                        // Reset quality and try again with resized image
                        quality = 75;
                        hasResized = true;
                        
                        using var resizedStream = new MemoryStream();
                        var resizedEncoder = new JpegEncoder
                        {
                            Quality = quality
                        };

                        await resizedImage.SaveAsync(resizedStream, resizedEncoder);
                        compressedData = resizedStream.ToArray();

                        _logger.LogInformation($"After resize: Size {compressedData.Length} bytes");

                        // If we achieved target after resize, break
                        if (compressedData.Length <= maxSizeBytes)
                        {
                            break;
                        }
                    }

                } while (quality >= 10 && compressedData?.Length > maxSizeBytes && attemptCount <= maxAttempts);

                // Fallback: if we still haven't achieved target size, return the best result we have
                if (compressedData == null || compressedData.Length > maxSizeBytes)
                {
                    _logger.LogWarning($"Could not compress image to target size. Best result: {compressedData?.Length ?? 0} bytes (target: {maxSizeBytes} bytes)");
                }

                _logger.LogInformation($"Image compression completed: {originalSize} bytes -> {compressedData?.Length ?? 0} bytes ({(double)(compressedData?.Length ?? 0) / originalSize * 100:F1}% of original)");

                return compressedData ?? imageData; // Fallback to original if compression failed
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error compressing image, returning original data");
                return imageData;
            }
        }
    }
}
