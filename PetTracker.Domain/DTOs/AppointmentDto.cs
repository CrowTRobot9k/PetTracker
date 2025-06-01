using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class AppointmentDto
    {
        public int id { get; set; }
        public int? userId {get;set;}
        public int? ownerId { get; set; }
        public int? petId { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
    }
}
