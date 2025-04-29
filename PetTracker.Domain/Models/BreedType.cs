using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class BreedType
{
    public int Id { get; set; }
    public int PetTypeId { get; set; }
    public string? Name { get; set; }
    public virtual ICollection<PetBreedType> PetBreedTypes { get; set; } = new List<PetBreedType>();
}
