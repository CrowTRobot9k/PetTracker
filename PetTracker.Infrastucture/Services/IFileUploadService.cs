using Microsoft.AspNetCore.Http;
using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public interface IFileUploadService
    {
        Task<int> CreateFileUpload(IFormFile file);
        Task<List<int>> CreateFileUploads(List<IFormFile> files);
    }
}
