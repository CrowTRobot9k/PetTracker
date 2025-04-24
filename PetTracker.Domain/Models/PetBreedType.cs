using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class PetBreedType
{
    public int Id { get; set; }

    public int PetId { get; set; }

    public int BreedTypeId { get; set; }

    public virtual BreedType BreedType { get; set; } = null!;

    public virtual Pet Pet { get; set; } = null!;
}
