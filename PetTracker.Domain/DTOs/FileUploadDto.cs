using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class FileUploadDto
    {
        public FileUploadDto() 
        { 
        }

        public FileUploadDto(FileUpload fu)
        {
            Id = fu.Id;
            FileName = fu.FileName;
            FileExtension = fu.FileExtension;
            FileData = fu.FileData;
            CreatedDate = fu.CreatedDate;
        }

        public int Id { get; set; }

        public string? FileName { get; set; }

        public string? FileExtension { get; set; }

        public byte[]? FileData { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
