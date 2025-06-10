using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class GetUserDto : UserDto
    {
        public GetUserDto(Models.AspNetUser user) : base(user)
        {
            UserPhotos = user.FileUploadMappings.Select(s => new FileDownloadDto(s.FileUpload)).ToList();
        }
        public List<FileDownloadDto> UserPhotos { get; set; } = new List<FileDownloadDto>();
    }
}
