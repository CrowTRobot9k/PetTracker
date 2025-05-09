using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class AddOwnerDto :OwnerDto
    {
        public List<IFormFile> OwnerPhotos { get; set; } = new List<IFormFile>();
    }
}
