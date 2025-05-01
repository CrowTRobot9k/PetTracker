using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class FileUpload
{
    public FileUpload()
    {
        FileUploadMappings = new HashSet<FileUploadMapping>();
    }
    public FileUpload(IFormFile file)
    {
        FileName = file.FileName;
        FileExtension = Path.GetExtension(file.FileName);
        if (file.Length > 0)
        {
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                FileData = ms.ToArray();
            }
        }
    }
    public int Id { get; set; }
    public string? FileName { get; set; }
    public string? FileExtension { get; set; }
    public byte[]? FileData { get; set; }
    public DateTime? CreatedDate { get; set; }
    public virtual ICollection<FileUploadMapping> FileUploadMappings { get; set; } = new List<FileUploadMapping>();
}
