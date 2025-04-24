using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class Pet
{
    public int Id { get; set; }

    public int? OwnerId { get; set; }

    public string? Name { get; set; }

    public int PetTypeId { get; set; }

    public string? Gender { get; set; }

    public virtual ICollection<FileUploadMapping> FileUploadMappings { get; set; } = new List<FileUploadMapping>();

    public virtual Owner? Owner { get; set; }

    public virtual ICollection<PetBreedType> PetBreedTypes { get; set; } = new List<PetBreedType>();

    public virtual PetType PetType { get; set; } = null!;
}
