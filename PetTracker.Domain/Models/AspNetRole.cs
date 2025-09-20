using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class AspNetRole : IdentityRole<string>
{
    public virtual ICollection<AspNetRoleClaim> AspNetRoleClaims { get; set; } = new List<AspNetRoleClaim>();

    public virtual ICollection<AspNetUser> Users { get; set; } = new List<AspNetUser>();
}
