using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class GetOwnerDto : OwnerDto
    {
        public GetOwnerDto(Models.Owner owner) : base(owner)
        {
            // OwnerPhotos removed to reduce payload - now loaded separately via API
            // OwnerPhotos = owner.FileUploadMappings.Select(s => new FileDownloadDto(s.FileUpload)).ToList();
        }
        // public List<FileDownloadDto> OwnerPhotos { get; set; } = new List<FileDownloadDto>();
    }
}
