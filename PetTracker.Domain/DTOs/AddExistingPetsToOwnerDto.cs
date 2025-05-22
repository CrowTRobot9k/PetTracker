using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class AddExistingPetsToOwnerDto
    {
        public int OwnerId { get; set; }
        public List<int> PetIds { get; set; } = new List<int>();
    }
}
