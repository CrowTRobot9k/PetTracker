using Microsoft.AspNetCore.Http;
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
    public class FileUploadService : ServiceBase, IFileUploadService
    {
        public FileUploadService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<int> CreateFileUpload(IFormFile file)
        { 
            var result = _dbContext.FileUploads.Add(new FileUpload(file));
            await _dbContext.SaveChangesAsync();

            return result.Entity.Id;
        }

        public async Task<List<int>> CreateFileUploads(List<IFormFile> files)
        {
            var fileUploads = files.Select(f => new FileUpload(f));

            foreach (var file in fileUploads)
            {
                file.CreatedDate = DateTime.UtcNow;
            }
            _dbContext.FileUploads.AddRange(fileUploads);
            await _dbContext.SaveChangesAsync();

            return fileUploads.Select(s => s.Id).ToList();
        }

    }
}
