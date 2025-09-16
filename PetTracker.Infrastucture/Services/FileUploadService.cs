using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Logging;
using PetTracker.Domain.Models;
using PetTracker.SqlDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public class FileUploadService : ServiceBase<FileUploadService>, IFileUploadService
    {
        private readonly IImageCompressionService _imageCompressionService;

        public FileUploadService(ILogger<FileUploadService> logger, IPtDbContext dbContext, IImageCompressionService imageCompressionService) : base(logger, dbContext)
        {
            _imageCompressionService = imageCompressionService;
        }

        public async Task<int> CreateFileUpload(IFormFile file)
        { 
            var fileUpload = await CreateFileUploadWithCompression(file);
            fileUpload.CreatedDate = DateTime.UtcNow;
            var result = _dbContext.FileUploads.Add(fileUpload);
            await _dbContext.SaveChangesAsync();

            return result.Entity.Id;
        }

        private async Task<FileUpload> CreateFileUploadWithCompression(IFormFile file)
        {
            var fileUpload = new FileUpload();
            fileUpload.FileName = file.FileName;
            fileUpload.FileExtension = Path.GetExtension(file.FileName);

            if (file.Length > 0)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                var originalData = ms.ToArray();

                // Check if it's an image file
                if (IsImageFile(fileUpload.FileExtension))
                {
                    try
                    {
                        _logger.LogInformation($"Compressing image file: {fileUpload.FileName} (Original size: {originalData.Length} bytes)");
                        
                        // Compress the image with timeout
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30)); // 30 second timeout
                        fileUpload.FileData = await _imageCompressionService.CompressImageAsync(originalData).WaitAsync(cts.Token);
                        _logger.LogInformation($"Compressed image: {fileUpload.FileName} (Compressed size: {fileUpload.FileData.Length} bytes)");
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogWarning($"Image compression timed out for file {fileUpload.FileName}, using original data");
                        fileUpload.FileData = originalData;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error compressing image {fileUpload.FileName}, using original data");
                        fileUpload.FileData = originalData;
                    }
                }
                else
                {
                    fileUpload.FileData = originalData;
                }
            }

            return fileUpload;
        }

        private bool IsImageFile(string extension)
        {
            if (string.IsNullOrEmpty(extension))
                return false;

            var imageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
            return imageExtensions.Contains(extension.ToLowerInvariant());
        }

        public async Task<List<int>> CreateFileUploads(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return new List<int>();
            }

            var saveResults = new List<FileUpload>();
            
            foreach (var file in files)
            {
                var fileUpload = await CreateFileUploadWithCompression(file);
                fileUpload.CreatedDate = DateTime.UtcNow;
                var result = _dbContext.FileUploads.Add(fileUpload);
                saveResults.Add(result.Entity);
            }

            await _dbContext.SaveChangesAsync();
            return saveResults.Select(s => s.Id).ToList();
        }

    }
}
