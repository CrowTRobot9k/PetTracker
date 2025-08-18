using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PetTracker.Domain;
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

public partial class PtDbContext : IdentityDbContext<AspNetUser>, IPtDbContext
{
    public PtDbContext()
    {
    }

    public PtDbContext(DbContextOptions<PtDbContext> options)
        : base(options)
    {
    }
    public virtual DbSet<Appointment> Appointments { get; set; }
    //public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
    //public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
    //public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
    //public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }
   // public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
    //public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }

    public virtual DbSet<BreedType> BreedTypes { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<FileUpload> FileUploads { get; set; }

    public virtual DbSet<FileUploadMapping> FileUploadMappings { get; set; }

    public virtual DbSet<Owner> Owners { get; set; }

    public virtual DbSet<Pet> Pets { get; set; }

    public virtual DbSet<PetBreedType> PetBreedTypes { get; set; }

    public virtual DbSet<PetType> PetTypes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseLazyLoadingProxies().UseSqlServer("Data Source=localhost\\SQLEXPRESS;Initial Catalog=PetTrackerDb;Integrated Security=True;Trust Server Certificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.End).HasColumnType("datetime");
            entity.Property(e => e.Start).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(500);
            entity.Property(e => e.UserId).HasMaxLength(450);

            //entity.HasOne(d => d.Owner).WithMany(p => p.Appointments)
            //    .HasForeignKey(d => d.OwnerId)
            //    .HasConstraintName("FK_Appointments_Owners");

            //entity.HasOne(d => d.Pet).WithMany(p => p.Appointments)
            //    .HasForeignKey(d => d.PetId)
            //    .HasConstraintName("FK_Appointments_Pets");

            //entity.HasOne(d => d.User).WithMany(p => p.Appointments)
            //    .HasForeignKey(d => d.UserId)
            //    .HasConstraintName("FK_Appointments_Users");
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

            entity.HasOne(d => d.PetType).WithMany(p => p.BreedTypes)
                .HasForeignKey(d => d.PetTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BreedTypes_PetTypes");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.Property(e => e.CompanyCode).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(500);
        });

        modelBuilder.Entity<FileUpload>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_FileUploadMappings");
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FileExtension).HasMaxLength(50);
            entity.Property(e => e.FileName).HasMaxLength(500);
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
            entity.Property(e => e.UserId).HasMaxLength(450);
            entity.Property(e => e.FirstName).HasMaxLength(500);
            entity.Property(e => e.LastName).HasMaxLength(500);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(500);
            entity.Property(e => e.State).HasMaxLength(2);
            entity.Property(e => e.ZipCode).HasMaxLength(9);
            entity.Property(e => e.Email).HasMaxLength(500);
            entity.Property(e => e.PrimaryPhone).HasMaxLength(15);
            entity.Property(e => e.SecondaryPhone).HasMaxLength(15);
            entity.Property(e => e.ReferredBy).HasMaxLength(500);
            entity.Property(e => e.Vet).HasMaxLength(500);
            entity.Property(e => e.VetPhone).HasMaxLength(15);

            entity.HasOne(d => d.User).WithMany(p => p.Owners)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Owners_Users");
        });

        modelBuilder.Entity<Pet>(entity =>
        {
            entity.Property(e => e.BirthDate).HasColumnType("datetime");
            entity.Property(e => e.Color).HasMaxLength(50);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateUpdated).HasColumnType("datetime");
            entity.Property(e => e.MedicalProblems).HasMaxLength(2000);
            entity.Property(e => e.Name).HasMaxLength(500);
            entity.Property(e => e.Sex).HasMaxLength(50);

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
            entity.HasKey(e => e.Id).HasName("PK__PetTypes__3214EC076E14B268");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Type).HasMaxLength(100);
        });

        base.OnModelCreating(modelBuilder);

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
