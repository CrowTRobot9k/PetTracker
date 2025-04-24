using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class AspNetUser: IdentityUser
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public int? CompanyId { get; set; }

    public virtual ICollection<AspNetUserClaim> AspNetUserClaims { get; set; } = new List<AspNetUserClaim>();

    public virtual ICollection<AspNetUserLogin> AspNetUserLogins { get; set; } = new List<AspNetUserLogin>();

    public virtual ICollection<AspNetUserToken> AspNetUserTokens { get; set; } = new List<AspNetUserToken>();

    public virtual Company? Company { get; set; }

    public virtual ICollection<FileUploadMapping> FileUploadMappings { get; set; } = new List<FileUploadMapping>();

    public virtual ICollection<Owner> Owners { get; set; } = new List<Owner>();

    public virtual ICollection<AspNetRole> Roles { get; set; } = new List<AspNetRole>();
}
