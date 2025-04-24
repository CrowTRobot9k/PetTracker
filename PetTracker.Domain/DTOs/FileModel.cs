using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class FileModel
    {
        public string? FileName { get; set; }
        public IFormFile FormFile { get; set; }
    }
}
