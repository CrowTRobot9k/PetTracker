using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PetTracker.Domain.Models;

namespace PetTracker.SqlDb.Models;

//generate context from db
/// <summary>
/// Scaffold-dbContext -Connection "Data Source=tcp:pettrackerdb.database.windows.net,1433;Initial Catalog=PetTrackerDb;User ID=;Password=;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False" 
/// -Provider Microsoft.EntityFrameworkCore.SqlServer 
/// -OutputDir Models 
/// -Context PtDbContext
/// </summary>
/// 

public partial class PtDbContext : DbContext, IPtDbContext
{
    public PtDbContext()
    {
    }

    public PtDbContext(DbContextOptions<PtDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AspNetRole> AspNetRoles { get; set; }

    public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }

    public virtual DbSet<AspNetUser> AspNetUsers { get; set; }

    public virtual DbSet<IdentityUserClaim<string>> UserClaims { get; set; }

    public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }

    public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }

    public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }

    public virtual DbSet<BreedType> BreedTypes { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<FileUpload> FileUploads { get; set; }

    public virtual DbSet<FileUploadMapping> FileUploadMappings { get; set; }

    public virtual DbSet<Owner> Owners { get; set; }

    public virtual DbSet<Pet> Pets { get; set; }

    public virtual DbSet<PetBreedType> PetBreedTypes { get; set; }

    public virtual DbSet<PetType> PetTypes { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Data Source=localhost\\SQLEXPRESS;Initial Catalog=PetTrackerDb;Integrated Security=True;Trust Server Certificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AspNetRole>(entity =>
        {
            entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                .IsUnique()
                .HasFilter("([NormalizedName] IS NOT NULL)");

            entity.Property(e => e.Name).HasMaxLength(256);
            entity.Property(e => e.NormalizedName).HasMaxLength(256);
        });

        modelBuilder.Entity<AspNetRoleClaim>(entity =>
        {
            entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

            entity.HasOne(d => d.Role).WithMany(p => p.AspNetRoleClaims).HasForeignKey(d => d.RoleId);
        });

        modelBuilder.Entity<AspNetUser>(entity =>
        {
            entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

            entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                .IsUnique()
                .HasFilter("([NormalizedUserName] IS NOT NULL)");

            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.NormalizedEmail).HasMaxLength(256);
            entity.Property(e => e.NormalizedUserName).HasMaxLength(256);
            entity.Property(e => e.UserName).HasMaxLength(256);

            entity.HasOne(d => d.Company).WithMany(p => p.AspNetUsers)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("FK_AspNetUsers_Company");

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "AspNetUserRole",
                    r => r.HasOne<AspNetRole>().WithMany().HasForeignKey("RoleId"),
                    l => l.HasOne<AspNetUser>().WithMany().HasForeignKey("UserId"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId");
                        j.ToTable("AspNetUserRoles");
                        j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                    });
        });

        modelBuilder.Entity<AspNetUserClaim>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.AspNetUserClaims).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<AspNetUserLogin>(entity =>
        {
            entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

            entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.AspNetUserLogins).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<AspNetUserToken>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

            entity.HasOne(d => d.User).WithMany(p => p.AspNetUserTokens).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<BreedType>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(500);
        });

        modelBuilder.Entity<FileUpload>(entity =>
        {
            entity.Property(e => e.FileName).HasMaxLength(500);
            entity.Property(e => e.FileExtension).HasMaxLength(50);
        });

        modelBuilder.Entity<FileUploadMapping>(entity =>
        {
            entity.Property(e => e.AspNetUserId).HasMaxLength(450);

            entity.HasOne(d => d.AspNetUser).WithMany(p => p.FileUploadMappings)
                .HasForeignKey(d => d.AspNetUserId)
                .HasConstraintName("FK_FileUploadMappings_AspNetUsers");

            entity.HasOne(d => d.Company).WithMany(p => p.FileUploadMappings)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("FK_FileUploadMappings_Companies");

            entity.HasOne(d => d.FileUpload).WithMany(p => p.FileUploadMappings)
                .HasForeignKey(d => d.FileUploadId)
                .HasConstraintName("FK_FileUploadMappings_FileUpload");

            entity.HasOne(d => d.Owner).WithMany(p => p.FileUploadMappings)
                .HasForeignKey(d => d.OwnerId)
                .HasConstraintName("FK_FileUploadMappings_Owners");

            entity.HasOne(d => d.Pet).WithMany(p => p.FileUploadMappings)
                .HasForeignKey(d => d.PetId)
                .HasConstraintName("FK_FileUploadMappings_Pets");
        });

        modelBuilder.Entity<Owner>(entity =>
        {
            entity.Property(e => e.Email).HasMaxLength(500);
            entity.Property(e => e.FirstName).HasMaxLength(500);
            entity.Property(e => e.LastName).HasMaxLength(500);
            entity.Property(e => e.Phone).HasMaxLength(500);
            entity.Property(e => e.UserId).HasMaxLength(450);

            entity.HasOne(d => d.User).WithMany(p => p.Owners)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Owners_Users");
        });

        modelBuilder.Entity<Pet>(entity =>
        {
            entity.Property(e => e.Sex).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(500);

            entity.HasOne(d => d.Owner).WithMany(p => p.Pets)
                .HasForeignKey(d => d.OwnerId)
                .HasConstraintName("FK_Pets_Owners");

            entity.HasOne(d => d.PetType).WithMany(p => p.Pets)
                .HasForeignKey(d => d.PetTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Pets_PetTypes");
        });

        modelBuilder.Entity<PetBreedType>(entity =>
        {
            entity.HasOne(d => d.BreedType).WithMany(p => p.PetBreedTypes)
                .HasForeignKey(d => d.BreedTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PetBreedTypes_BreedTypes");

            entity.HasOne(d => d.Pet).WithMany(p => p.PetBreedTypes)
                .HasForeignKey(d => d.PetId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PetBreedTypes_Pets");
        });

        modelBuilder.Entity<PetType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PetTypes__3214EC07664C7AB3");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Type).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
