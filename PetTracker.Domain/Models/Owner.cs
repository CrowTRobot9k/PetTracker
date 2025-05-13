using PetTracker.Domain.DTOs;
using System;
using System.Collections.Generic;

namespace PetTracker.Domain.Models;

public partial class Owner
{
    public Owner()
    {
    }
    public Owner(OwnerDto owner)
    {
        UserId = owner.UserId;
        FirstName = owner.FirstName;
        LastName = owner.LastName;
        Address = owner.Address;
        City = owner.City;
        State = owner.State;
        ZipCode = owner.ZipCode;
        Email = owner.Email;
        PrimaryPhone = owner.PrimaryPhone;
        SecondaryPhone = owner.SecondaryPhone;
        ReferredBy = owner.ReferredBy;
        Vet = owner.Vet;
        VetPhone = owner.VetPhone;
    }

    public void UpdateOwner(AddOwnerDto owner)
    {
        Id = owner.Id;
        UserId = owner.UserId;
        FirstName = owner.FirstName;
        LastName = owner.LastName;
        Address = owner.Address;
        City = owner.City;
        State = owner.State;
        ZipCode = owner.ZipCode;
        Email = owner.Email;
        PrimaryPhone = owner.PrimaryPhone;
        SecondaryPhone = owner.SecondaryPhone;
        ReferredBy = owner.ReferredBy;
        Vet = owner.Vet;
        VetPhone = owner.VetPhone;
    }
    public int Id { get; set; }
    public string? UserId { get; set; }
    public string? FirstName { get; set; } = null!;
    public string? LastName { get; set; } = null!;
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? Email { get; set; }
    public string? PrimaryPhone { get; set; } = null!;
    public string? SecondaryPhone { get; set; }
    public string? ReferredBy { get; set; }
    public string? Vet { get; set; }
    public string? VetPhone { get; set; }

    public virtual ICollection<FileUploadMapping> FileUploadMappings { get; set; } = new List<FileUploadMapping>();

    public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();

    public virtual AspNetUser? User { get; set; }
}
