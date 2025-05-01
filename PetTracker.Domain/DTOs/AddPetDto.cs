using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class AddPetDto : PetDto
    {
        public List<IFormFile> PetPhotos { get; set; } = new List<IFormFile>();
    }
}
