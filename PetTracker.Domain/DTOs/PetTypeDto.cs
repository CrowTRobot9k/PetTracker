using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class PetTypeDto
    {
        public PetTypeDto()
        { 
        }
        public PetTypeDto(PetType pt)
        {
            Id = pt.Id;
            Type = pt.Type; 
        }

        public int Id { get; set; }

        public string Type { get; set; } = null!;
    }
}
