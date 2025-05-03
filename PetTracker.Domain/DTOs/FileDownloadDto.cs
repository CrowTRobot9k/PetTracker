using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class FileDownloadDto
    {
        public FileDownloadDto()
        {
        }

        public FileDownloadDto(FileUpload fu)
        {
            Id = fu.Id;
            FileName = fu.FileName;
            FileExtension = fu.FileExtension;
            FileDataBase64 = fu.FileData != null ? Convert.ToBase64String(fu.FileData) : null;
            CreatedDate = fu.CreatedDate;
        }

        public int Id { get; set; }

        public string? FileName { get; set; }

        public string? FileExtension { get; set; }
        public string? FileDataBase64 { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
