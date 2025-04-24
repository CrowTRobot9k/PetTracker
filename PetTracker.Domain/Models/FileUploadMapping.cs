using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class FileUploadMapping
{
    public int Id { get; set; }

    public string? AspNetUserId { get; set; }

    public int? OwnerId { get; set; }

    public int? CompanyId { get; set; }

    public int? PetId { get; set; }

    public int? FileUploadId { get; set; }

    public virtual AspNetUser? AspNetUser { get; set; }

    public virtual Company? Company { get; set; }

    public virtual FileUpload? FileUpload { get; set; }

    public virtual Owner? Owner { get; set; }

    public virtual Pet? Pet { get; set; }
}
