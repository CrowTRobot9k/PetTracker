using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class FileUpload
{
    public int Id { get; set; }

    public string? FileName { get; set; }

    public string? FilePath { get; set; }

    public string? FileType { get; set; }

    public string? FileDescription { get; set; }

    public virtual ICollection<FileUploadMapping> FileUploadMappings { get; set; } = new List<FileUploadMapping>();
}
