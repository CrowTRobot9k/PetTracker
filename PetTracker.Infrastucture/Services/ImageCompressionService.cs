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

            // Always compress images to ensure they're under the limit
            _logger.LogInformation($"Compressing image from {imageData.Length} bytes to target {maxSizeBytes} bytes");

            // Check available memory before processing
            var availableMemory = GC.GetTotalMemory(false);
            var imageSize = imageData.Length;
            
            // If we don't have enough memory for processing (need at least 3x image size), skip compression
            if (availableMemory < imageSize * 3)
            {
                _logger.LogWarning($"Insufficient memory for image compression. Available: {availableMemory}, Required: {imageSize * 3}. Returning original image.");
                return imageData;
            }

            try
            {
                using var image = Image.Load(imageData);
                var originalSize = imageData.Length;
                _logger.LogInformation($"Compressing image from {originalSize} bytes to target {maxSizeBytes} bytes");

                // Start with aggressive compression settings
                int quality = 70; // Start lower for better compression
                byte[] compressedData = null;
                int maxAttempts = 15; // More attempts to ensure we get under limit
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
                        Quality = Math.Max(quality, 5) // Lower minimum quality for better compression
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

                    // More aggressive quality reduction
                    quality -= 10; // Smaller steps for better control

                    // If quality gets too low and we haven't resized yet, try resizing the image
                    if (quality < 30 && !hasResized)
                    {
                        _logger.LogInformation("Quality too low, attempting to resize image");
                        
                        // Calculate resize factor based on current size vs target (more aggressive)
                        var resizeFactor = Math.Sqrt((double)maxSizeBytes / compressedData.Length) * 0.8; // 20% more aggressive
                        var newWidth = (int)(image.Width * resizeFactor);
                        var newHeight = (int)(image.Height * resizeFactor);

                        // Ensure minimum dimensions but allow smaller sizes
                        newWidth = Math.Max(newWidth, 50);
                        newHeight = Math.Max(newHeight, 50);

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
                        quality = 60;
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

                } while (quality >= 5 && compressedData?.Length > maxSizeBytes && attemptCount <= maxAttempts);

                // Final fallback: if we still haven't achieved target size, force extreme compression
                if (compressedData == null || compressedData.Length > maxSizeBytes)
                {
                    _logger.LogWarning($"Could not compress image to target size with normal methods. Attempting extreme compression.");
                    
                    // Extreme compression as last resort
                    using var extremeImage = Image.Load(imageData);
                    var extremeResizeFactor = Math.Sqrt((double)maxSizeBytes / imageData.Length) * 0.5; // 50% more aggressive
                    var extremeWidth = Math.Max((int)(extremeImage.Width * extremeResizeFactor), 32);
                    var extremeHeight = Math.Max((int)(extremeImage.Height * extremeResizeFactor), 32);
                    
                    extremeImage.Mutate(x => x.Resize(extremeWidth, extremeHeight));
                    
                    using var extremeStream = new MemoryStream();
                    var extremeEncoder = new JpegEncoder { Quality = 5 };
                    await extremeImage.SaveAsync(extremeStream, extremeEncoder);
                    compressedData = extremeStream.ToArray();
                    
                    _logger.LogInformation($"Extreme compression result: {compressedData.Length} bytes");
                }

                // Final validation - if still too large, truncate the data (last resort)
                if (compressedData != null && compressedData.Length > maxSizeBytes)
                {
                    _logger.LogError($"Image still too large after all compression attempts: {compressedData.Length} bytes. Truncating to {maxSizeBytes} bytes.");
                    Array.Resize(ref compressedData, maxSizeBytes);
                }

                _logger.LogInformation($"Image compression completed: {originalSize} bytes -> {compressedData?.Length ?? 0} bytes ({(double)(compressedData?.Length ?? 0) / originalSize * 100:F1}% of original)");

                // Force garbage collection to free memory in container environments
                GC.Collect();
                GC.WaitForPendingFinalizers();

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
