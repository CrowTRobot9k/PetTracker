using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class BreedTypeDto
    {
        public BreedTypeDto(BreedType bt)
        {
            Id = bt.Id;
            PetTypeId = bt.PetTypeId;
            Name = bt.Name;
        }
        public int Id { get; set; }
        public int PetTypeId { get; set; }
        public string? Name { get; set; }

    }
}
