using Microsoft.Extensions.Logging;
using PetTracker.SqlDb.Models;


using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Data.SqlClient;
namespace PetTracker.Infrastucture.Services
{
    public class PetService : ServiceBase<PetService>, IPetService
    {
        private readonly IFileUploadService _fileUploadService;
        private readonly IImageCompressionService _imageCompressionService;
        private readonly IPayloadSizeService _payloadSizeService;

        public PetService(ILogger<PetService> logger, IPtDbContext dbContext, IFileUploadService fileUploadService, IImageCompressionService imageCompressionService, IPayloadSizeService payloadSizeService) : base(logger, dbContext)
        {
            _fileUploadService = fileUploadService;
            _imageCompressionService = imageCompressionService;
            _payloadSizeService = payloadSizeService;
        }

        public async Task<int> CreatePet(AddPetDto pet)
        {
            var uploadIds = new List<int>();
            if (pet.PetPhotos.Any())
            {
                uploadIds = await _fileUploadService.CreateFileUploads(pet.PetPhotos);
            }

            var addPet = new Pet(pet);

            await _dbContext.Pets.AddAsync(addPet);
            await _dbContext.SaveChangesAsync();

            var tasks = new List<Task>();

            var fileMappings = new List<FileUploadMapping>();
            if (uploadIds.Any())
            {
                fileMappings = fileMappings = uploadIds.Select(s => new FileUploadMapping()
                {
                    PetId = addPet.Id,
                    FileUploadId = s
                }).ToList();

                tasks.Add(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings));
            }


            if (pet.BreedTypeIds?.Any() ?? false)
            {
                var breedTypes = pet.BreedTypeIds.Select(s => new PetBreedType()
                {
                    PetId = addPet.Id,
                    BreedTypeId = s
                });

                tasks.Add(_dbContext.PetBreedTypes.AddRangeAsync(breedTypes));
            }

            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
            }

            await _dbContext.SaveChangesAsync();

            return addPet.Id;
        }

        public async Task<int> UpdatePet(AddPetDto pet)
        {
            var uploadIds = new List<int>();
            if (pet.PetPhotos.Any())
            {
                uploadIds = await _fileUploadService.CreateFileUploads(pet.PetPhotos);
            }

            var existingPet = await _dbContext.Pets
                .Include(p => p.PetBreedTypes)
                    .ThenInclude(pbt => pbt.BreedType)
                .Include(p => p.FileUploadMappings)
                    .ThenInclude(fum => fum.FileUpload)
                .FirstOrDefaultAsync(p => p.Id == pet.Id);
            if (existingPet == null)
            {
                throw new Exception("Pet not found");
            }

            var tasks = new List<Task>();

            var fileMappings = new List<FileUploadMapping>();
            if (uploadIds.Any())
            {
                // Delete the existing FileUploadMappings for this pet
                tasks.Add(_dbContext.FileUploadMappings
                    .Where(fum => fum.PetId == existingPet.Id)
                    .ExecuteDeleteAsync());
                
                // Create new FileUploadMappings for the new uploadIds
                fileMappings = uploadIds.Select(s => new FileUploadMapping()
                {
                    PetId = existingPet.Id,
                    FileUploadId = s
                }).ToList();

                tasks.Add(_dbContext.FileUploadMappings.AddRangeAsync(fileMappings));
            }

            if (existingPet.PetBreedTypes?.Any()??false &&
                !pet.BreedTypeIds.All(b=> existingPet.PetBreedTypes.Select(s=>s.BreedType.Id).Contains(b)))
            {
                //add non existing breed types
                var breedTypes = pet.BreedTypeIds.Where(x=> !existingPet.PetBreedTypes.Select(s=>s.BreedTypeId).Contains(x)).Select(s => new PetBreedType()
                {
                    PetId = existingPet.Id,
                    BreedTypeId = s
                });
                //remove breed types not sent for save
                _dbContext.PetBreedTypes.RemoveRange(existingPet.PetBreedTypes.Where(w => !pet.BreedTypeIds.Contains(w.BreedTypeId)));

                if (breedTypes.Any())
                {
                    tasks.Add(_dbContext.PetBreedTypes.AddRangeAsync(breedTypes));
                }
            }

            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
            }

            existingPet.UpdatePet(pet);

            await _dbContext.SaveChangesAsync();

            return existingPet.Id;
        }

        public async Task<int> DeletePet(int petId)
        {
            var petParam = new SqlParameter("@petId", petId);
            return await _dbContext.Database.ExecuteSqlAsync($"Exec DeletePet {petParam}");
        }

        public async Task<List<GetPetDto>> GetPets(int? ownerId = null)
        {
            var results = await _dbContext.Pets
                .AsNoTracking()
                .Include(p => p.Owner)
                .Include(p => p.PetType)
                .Include(p => p.PetBreedTypes)
                    .ThenInclude(pbt => pbt.BreedType)
                //.Include(p => p.FileUploadMappings)
                //    .ThenInclude(fum => fum.FileUpload)
                .Where(w => ownerId == null || w.OwnerId == ownerId)
                .ToListAsync();
            return results.Select(s => new GetPetDto(s)).ToList();
        }

        public async Task<List<PetDto>> GetPetList(int? ownerId = null)
        {
            var results = await _dbContext.Pets
                .AsNoTracking()
                .Include(p => p.Owner)
                .Include(p => p.PetType)
                .Include(p => p.PetBreedTypes)
                    .ThenInclude(pbt => pbt.BreedType)
                //.Include(p => p.FileUploadMappings)
                //    .ThenInclude(fum => fum.FileUpload)
                .Where(w => ownerId == null || w.OwnerId == ownerId)
                .ToListAsync();
            return results.Select(s => new PetDto(s)).ToList();
        }

        public async Task<List<PetTypeDto>> GetPetTypes()
        {
            try
            {
                var petTypes = await _dbContext.PetTypes
                    .AsNoTracking()
                    .ToListAsync();
                return petTypes.Select(s=>new PetTypeDto(s)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting pet types.");
                return new List<PetTypeDto>();
            }
        }
        public async Task<List<BreedTypeDto>> GetPetBreeds(int petTypeId)
        {
            try
            {
                var petTypes = await _dbContext.BreedTypes
                    .AsNoTracking()
                    .Where(i=>i.PetTypeId == petTypeId)
                    .ToListAsync();
                return petTypes.Select(s => new BreedTypeDto(s)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting breed types.");
                return new List<BreedTypeDto>();
            }
        }

        public async Task<List<FileDownloadDto>> GetPetPhotos(int petId)
        {
            try
            {
                var results = await _dbContext.Pets
                    .AsNoTracking()
                    .Include(p => p.FileUploadMappings)
                        .ThenInclude(fum => fum.FileUpload)
                    .Where(p => p.Id == petId)
                    .SelectMany(p => p.FileUploadMappings)
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
                        if (fileUpload.FileData != null && IsImageFile(fileUpload.FileExtension) && fileUpload.FileData.Length > 200 * 1024) // 200KB
                        {
                            // Check available memory before processing each image
                            var availableMemory = GC.GetTotalMemory(false);
                            if (availableMemory < fileUpload.FileData.Length * 4) // Need 4x image size for processing
                            {
                                _logger.LogWarning($"Skipping compression for {fileUpload.FileName} due to insufficient memory. Available: {availableMemory}");
                                compressedResults.Add(new FileDownloadDto(fileUpload));
                                continue;
                            }

                            // Compress the image with timeout
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15)); // Reduced timeout for containers
                            var compressedData = await _imageCompressionService.CompressImageAsync(fileUpload.FileData).WaitAsync(cts.Token);
                            compressedResults.Add(new FileDownloadDto(fileUpload, compressedData));
                        }
                        else
                        {
                            // Use original data
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

                // Final garbage collection to free memory
                GC.Collect();
                GC.WaitForPendingFinalizers();

                // Validate and limit payload size to 300KB
                var limitedResults = _payloadSizeService.LimitPhotosToSize(compressedResults, 300);
                
                if (limitedResults.Count < compressedResults.Count)
                {
                    _logger.LogWarning($"Limited pet photos from {compressedResults.Count} to {limitedResults.Count} to stay under 300KB payload limit");
                }

                return limitedResults;
            }
            catch (OutOfMemoryException ex)
            {
                _logger.LogError(ex, $"Out of memory error in GetPetPhotos for petId: {petId}");
                return new List<FileDownloadDto>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetPetPhotos for petId: {petId}");
                return new List<FileDownloadDto>();
            }
        }

        public async Task<Dictionary<int, List<FileDownloadDto>>> GetPetPhotosBatch(List<int> petIds)
        {
            if (petIds == null || !petIds.Any())
            {
                return new Dictionary<int, List<FileDownloadDto>>();
            }

            var results = await _dbContext.Pets
                .AsNoTracking()
                .Include(p => p.FileUploadMappings)
                    .ThenInclude(fum => fum.FileUpload)
                .Where(p => petIds.Contains(p.Id))
                .SelectMany(p => p.FileUploadMappings)
                .Select(fum => new { fum.PetId, FileUpload = fum.FileUpload })
                .ToListAsync();

            var groupedResults = results.GroupBy(r => r.PetId)
                .ToDictionary(g => g.Key, g => g.Select(r => r.FileUpload).ToList());

            var batchResults = new Dictionary<int, List<FileDownloadDto>>();

            foreach (var petId in petIds)
            {
                if (groupedResults.ContainsKey(petId))
                {
                    var fileUploads = groupedResults[petId];
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

                    batchResults[petId] = compressedResults;
                }
                else
                {
                    batchResults[petId] = new List<FileDownloadDto>();
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
    }
}
