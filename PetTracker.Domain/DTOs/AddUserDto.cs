using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class AddUserDto : UserDto
    {
        public List<IFormFile> UserPhotos { get; set; } = new List<IFormFile>();
    }
}
