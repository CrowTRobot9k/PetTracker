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

        public PetService(ILogger<PetService> logger, IPtDbContext dbContext, IFileUploadService fileUploadService, IImageCompressionService imageCompressionService) : base(logger, dbContext)
        {
            _fileUploadService = fileUploadService;
            _imageCompressionService = imageCompressionService;
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
                _dbContext.FileUploadMappings.RemoveRange(existingPet.FileUploadMappings);
                _dbContext.FileUploads.RemoveRange(existingPet.FileUploadMappings.Select(s => s.FileUpload));
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
                var petTypes = await _dbContext.PetTypes.ToListAsync();
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
                var petTypes = await _dbContext.BreedTypes.Where(i=>i.PetTypeId == petTypeId).ToListAsync();
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
            var results = await _dbContext.Pets
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
            
            foreach (var fileUpload in results)
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

            return compressedResults;
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
