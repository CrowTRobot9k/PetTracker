using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class FileUploadDto
    {
        public int Id { get; set; }

        public string? FileName { get; set; }

        public string? FileExtension { get; set; }

        public byte[]? FileData { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
