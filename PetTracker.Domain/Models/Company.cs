using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class Company
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? CompanyCode { get; set; }
    public virtual ICollection<AspNetUser> AspNetUsers { get; set; } = new List<AspNetUser>();
    public virtual ICollection<FileUploadMapping> FileUploadMappings { get; set; } = new List<FileUploadMapping>();
}
