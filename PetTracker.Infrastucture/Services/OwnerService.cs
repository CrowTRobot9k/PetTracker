using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using PetTracker.SqlDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public class OwnerService : ServiceBase<OwnerService>, IOwnerService
    {
        private readonly IFileUploadService _fileUploadService;
        private readonly IImageCompressionService _imageCompressionService;
        private readonly IPayloadSizeService _payloadSizeService;

        public OwnerService(ILogger<OwnerService> logger, IPtDbContext dbContext, IFileUploadService fileUploadService, IImageCompressionService imageCompressionService, IPayloadSizeService payloadSizeService) : base(logger, dbContext)
        {
            _fileUploadService = fileUploadService;
            _imageCompressionService = imageCompressionService;
            _payloadSizeService = payloadSizeService;
        }
        public async Task<int> CreateOwner(AddOwnerDto owner)
        {
            var uploadIds = new List<int>();
            if (owner.OwnerPhotos.Any())
            {
                uploadIds = await _fileUploadService.CreateFileUploads(owner.OwnerPhotos);
            }

            var addOwner = new Owner(owner);

            await _dbContext.Owners.AddAsync(addOwner);
            await _dbContext.SaveChangesAsync();

            var tasks = new List<Task>();

            var fileMappings = new List<FileUploadMapping>();
            if (uploadIds.Any())
            {
                fileMappings = fileMappings = uploadIds.Select(s => new FileUploadMapping()
                {
                    OwnerId = addOwner.Id,
                    FileUploadId = s
                }).ToList();

                tasks.Add(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings));
            }

            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
            }

            await _dbContext.SaveChangesAsync();

            return addOwner.Id;
        }
        public async Task<int> UpdateOwner(AddOwnerDto owner)
        {
            var uploadIds = new List<int>();
            if (owner.OwnerPhotos.Any())
            {
                uploadIds = await _fileUploadService.CreateFileUploads(owner.OwnerPhotos);
            }

            var existingOwner = await _dbContext.Owners
                .Include(o => o.FileUploadMappings)
                    .ThenInclude(fum => fum.FileUpload)
                .FirstOrDefaultAsync(p => p.Id == owner.Id);
            if (existingOwner == null)
            {
                throw new Exception("Owner not found");
            }

            var tasks = new List<Task>();

            var fileMappings = new List<FileUploadMapping>();
            if (uploadIds.Any())
            {
                // Delete the existing FileUploadMappings for this owner
                tasks.Add(_dbContext.FileUploadMappings
                    .Where(fum => fum.OwnerId == existingOwner.Id)
                    .ExecuteDeleteAsync());
                
                // Create new FileUploadMappings for the new uploadIds
                fileMappings = uploadIds.Select(s => new FileUploadMapping()
                {
                    OwnerId = existingOwner.Id,
                    FileUploadId = s
                }).ToList();

                tasks.Add(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings));
            }

            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
            }

            existingOwner.UpdateOwner(owner);

            await _dbContext.SaveChangesAsync();

            return existingOwner.Id;
        }
        public async Task<List<GetOwnerDto>> GetOwners(int? companyId = null)
        {
            var results = await _dbContext.Owners
                .AsNoTracking()
                .Include(o => o.User)
                .Include(o => o.Pets)
                    .ThenInclude(p => p.PetType)
                .Include(o => o.Pets)
                    .ThenInclude(p => p.PetBreedTypes)
                        .ThenInclude(pbt => pbt.BreedType)
                //.Include(o => o.FileUploadMappings)
                //    .ThenInclude(fum => fum.FileUpload)
                .Where(w => companyId == null || (w.User != null && w.User.CompanyId == companyId))
                .ToListAsync();
            if (results == null || !results.Any())
            { 
                return new List<GetOwnerDto>();
            }

            return results.Select(s => new GetOwnerDto(s)).ToList();
        }

        public async Task<List<OwnerDto>> GetOwnerList(int? companyId = null)
        {
            var results = await _dbContext.Owners
                .AsNoTracking()
                .Include(o => o.User)
                .Include(o => o.Pets)
                    .ThenInclude(p => p.PetType)
                .Include(o => o.Pets)
                    .ThenInclude(p => p.PetBreedTypes)
                        .ThenInclude(pbt => pbt.BreedType)
                //.Include(o => o.FileUploadMappings)
                //    .ThenInclude(fum => fum.FileUpload)
                .Where(w => companyId == null || (w.User != null && w.User.CompanyId == companyId))
                .ToListAsync();
            if (results == null || !results.Any())
            {
                return new List<OwnerDto>();
            }

            return results.Select(s => new OwnerDto(s)).ToList();
        }

        public async Task<List<FileDownloadDto>> GetOwnerPhotos(int ownerId)
        {
            try
            {
                var results = await _dbContext.Owners
                    .AsNoTracking()
                    .Include(o => o.FileUploadMappings)
                        .ThenInclude(fum => fum.FileUpload)
                    .Where(o => o.Id == ownerId)
                    .SelectMany(o => o.FileUploadMappings)
                    .Select(fum => fum.FileUpload)
                    .ToListAsync();

                if (results == null || !results.Any())
                {
                    return new List<FileDownloadDto>();
                }

                var compressedResults = new List<FileDownloadDto>();
                
                // Process images one at a time to manage memory in container environments
                foreach (var fileUpload in results)
                {
                    try
                    {
                        if (fileUpload.FileData != null && IsImageFile(fileUpload.FileExtension))
                        {
                            // Always compress images to ensure they're under 200KB
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                            var compressedData = await _imageCompressionService.CompressImageAsync(fileUpload.FileData).WaitAsync(cts.Token);
                            compressedResults.Add(new FileDownloadDto(fileUpload, compressedData));
                        }
                        else
                        {
                            // Use original data for non-image files
                            compressedResults.Add(new FileDownloadDto(fileUpload));
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogWarning($"Image compression timed out for file {fileUpload.FileName}, using original data");
                        compressedResults.Add(new FileDownloadDto(fileUpload));
                    }
                    catch (OutOfMemoryException ex)
                    {
                        _logger.LogError(ex, $"Out of memory error compressing image {fileUpload.FileName}, using original data");
                        compressedResults.Add(new FileDownloadDto(fileUpload));
                        
                        // Force garbage collection after memory error
                        GC.Collect();
                        GC.WaitForPendingFinalizers();
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error compressing image {fileUpload.FileName}, using original data");
                        compressedResults.Add(new FileDownloadDto(fileUpload));
                    }
                }

                // Force garbage collection to free memory
                GC.Collect();
                GC.WaitForPendingFinalizers();

                // Validate and limit payload size to 300KB
                var limitedResults = _payloadSizeService.LimitPhotosToSize(compressedResults, 300);
                
                if (limitedResults.Count < compressedResults.Count)
                {
                    _logger.LogWarning($"Limited owner photos from {compressedResults.Count} to {limitedResults.Count} to stay under 300KB payload limit");
                }

                return limitedResults;
            }
            catch (OutOfMemoryException ex)
            {
                _logger.LogError(ex, $"Out of memory error in GetOwnerPhotos for ownerId: {ownerId}");
                return new List<FileDownloadDto>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetOwnerPhotos for ownerId: {ownerId}");
                return new List<FileDownloadDto>();
            }
        }

        public async Task<Dictionary<int, List<FileDownloadDto>>> GetOwnerPhotosBatch(List<int> ownerIds)
        {
            if (ownerIds == null || !ownerIds.Any())
            {
                return new Dictionary<int, List<FileDownloadDto>>();
            }

            var results = await _dbContext.Owners
                .AsNoTracking()
                .Include(o => o.FileUploadMappings)
                    .ThenInclude(fum => fum.FileUpload)
                .Where(o => ownerIds.Contains(o.Id))
                .SelectMany(o => o.FileUploadMappings)
                .Select(fum => new { fum.OwnerId, FileUpload = fum.FileUpload })
                .ToListAsync();

            var groupedResults = results.GroupBy(r => r.OwnerId)
                .ToDictionary(g => g.Key, g => g.Select(r => r.FileUpload).ToList());

            var batchResults = new Dictionary<int, List<FileDownloadDto>>();

            foreach (var ownerId in ownerIds)
            {
                if (groupedResults.ContainsKey(ownerId))
                {
                    var fileUploads = groupedResults[ownerId];
                    var compressedResults = new List<FileDownloadDto>();

                    foreach (var fileUpload in fileUploads)
                    {
                        if (fileUpload.FileData != null && IsImageFile(fileUpload.FileExtension) && fileUpload.FileData.Length > 200 * 1024) // 200KB
                        {
                            try
                            {
                                // Compress the image with timeout
                                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30)); // 30 second timeout
                                var compressedData = await _imageCompressionService.CompressImageAsync(fileUpload.FileData).WaitAsync(cts.Token);
                                compressedResults.Add(new FileDownloadDto(fileUpload, compressedData));
                            }
                            catch (OperationCanceledException)
                            {
                                _logger.LogWarning($"Image compression timed out for file {fileUpload.FileName}, using original data");
                                compressedResults.Add(new FileDownloadDto(fileUpload));
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError(ex, $"Error compressing image {fileUpload.FileName}, using original data");
                                compressedResults.Add(new FileDownloadDto(fileUpload));
                            }
                        }
                        else
                        {
                            // Use original data
                            compressedResults.Add(new FileDownloadDto(fileUpload));
                        }
                    }

                    batchResults[ownerId] = compressedResults;
                }
                else
                {
                    batchResults[ownerId] = new List<FileDownloadDto>();
                }
            }

            return batchResults;
        }

        private bool IsImageFile(string extension)
        {
            if (string.IsNullOrEmpty(extension))
                return false;

            var imageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
            return imageExtensions.Contains(extension.ToLowerInvariant());
        }

        public async Task<bool> AddExistingPetsToOwner(AddExistingPetsToOwnerDto model)
        { 
            var existingPets = _dbContext.Pets
                .Where(w => model.PetIds.Contains(w.Id))
                .ToList();

            if (existingPets == null || !existingPets.Any())
            {
                return false;
            }

            existingPets.ForEach(f =>
            {
                f.OwnerId = model.OwnerId;
            });

            _dbContext.Pets.UpdateRange(existingPets);

            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RemoveExistingPetsToOwner(AddExistingPetsToOwnerDto model)
        {
            var existingPets = _dbContext.Pets
                .Where(w => model.PetIds.Contains(w.Id))
                .ToList();

            if (existingPets == null || !existingPets.Any())
            {
                return false;
            }

            existingPets.ForEach(f =>
            {
                f.OwnerId = null;
            });

            _dbContext.Pets.UpdateRange(existingPets);

            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}
