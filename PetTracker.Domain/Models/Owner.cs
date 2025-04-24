using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class Owner
{
    public int Id { get; set; }

    public string? UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public virtual ICollection<FileUploadMapping> FileUploadMappings { get; set; } = new List<FileUploadMapping>();

    public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();

    public virtual AspNetUser? User { get; set; }
}
