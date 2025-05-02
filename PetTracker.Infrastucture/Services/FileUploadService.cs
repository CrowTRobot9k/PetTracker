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
    public class FileUploadService : ServiceBase, IFileUploadService
    {
        public FileUploadService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<int> CreateFileUpload(IFormFile file)
        { 
            var fileUpload = new FileUpload(file);
            fileUpload.CreatedDate = DateTime.UtcNow;
            var result = _dbContext.FileUploads.Add(new FileUpload(file));
            await _dbContext.SaveChangesAsync();

            return result.Entity.Id;
        }

        public async Task<List<int>> CreateFileUploads(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return new List<int>();
            }

            //var results = files.Select(f => CreateFileUpload(f));
            //await Task.WhenAll(results);

            //return results.Select(s => s.Result).ToList();
            var fileUploads = files.Select(f => new FileUpload(f));

            var saveResults = new List<FileUpload>();
            foreach (var file in fileUploads)
            {
                file.CreatedDate = DateTime.UtcNow;
                var result = _dbContext.FileUploads.Add(file);
                saveResults.Add(result.Entity);
            }

            await _dbContext.SaveChangesAsync();

            return saveResults.Select(s => s.Id).ToList();
            //return results.Select(s=>s.Entity.Id).ToList();

            //return fileUploads.Select(s => s.Id).ToList();

            //var uploadIds = new List<int>();
            //foreach (var file in files)
            //{
            //    var result = await CreateFileUpload(file);
            //    uploadIds.Add(result);
            //}

            //return uploadIds;
        }

    }
}
