using PetTracker.Domain.DTOs;
using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class Pet
{
    public Pet()
    {
    }
    public Pet(AddPetDto pet)
    {
        OwnerId = pet.OwnerId;
        Name = pet.Name;
        PetTypeId = pet.PetTypeId;
        Color = pet.Color;
        BirthDate = pet.BirthDate;
        Weight = pet.Weight;
        Sex = pet.Sex;
        MedicalProblems = pet.MedicalProblems;
    }
    public void UpdatePet(AddPetDto pet)
    {
        Name = pet.Name;
        PetTypeId = pet.PetTypeId;
        Color = pet.Color;
        BirthDate = pet.BirthDate;
        Weight = pet.Weight;
        Sex = pet.Sex;
        MedicalProblems = pet.MedicalProblems;
    }

    public int Id { get; set; }
    public int? OwnerId { get; set; }
    public string? Name { get; set; }
    public int PetTypeId { get; set; }
    public string? Color { get; set; }
    public DateTime? BirthDate { get; set; }
    public double? Weight { get; set; }
    public string? Sex { get; set; }
    public string? MedicalProblems { get; set; }
    public DateTime? DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }

    public virtual ICollection<FileUploadMapping> FileUploadMappings { get; set; } = new List<FileUploadMapping>();

    public virtual Owner? Owner { get; set; }

    public virtual ICollection<PetBreedType> PetBreedTypes { get; set; } = new List<PetBreedType>();

    public virtual PetType PetType { get; set; } = null!;
}
