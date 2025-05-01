using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class PetType
{
    public int Id { get; set; }
    public string Type { get; set; } = null!;
    public virtual ICollection<BreedType> BreedTypes { get; set; } = new List<BreedType>();
    public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
}
