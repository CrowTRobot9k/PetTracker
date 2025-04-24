using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.SqlDb.Models
{
    public interface IPtDbContext
    {
        DbSet<AspNetRole> AspNetRoles { get; set; }

        DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }

        DbSet<AspNetUser> AspNetUsers { get; set; }

        DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }

        DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }

        DbSet<AspNetUserToken> AspNetUserTokens { get; set; }

        DbSet<BreedType> BreedTypes { get; set; }

        DbSet<Company> Companies { get; set; }

        DbSet<FileUpload> FileUploads { get; set; }

        DbSet<FileUploadMapping> FileUploadMappings { get; set; }

        DbSet<Owner> Owners { get; set; }

        DbSet<Pet> Pets { get; set; }

        DbSet<PetBreedType> PetBreedTypes { get; set; }

        DbSet<PetType> PetTypes { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
