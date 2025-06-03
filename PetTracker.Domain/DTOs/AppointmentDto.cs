using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class AppointmentDto
    {
        public AppointmentDto()
        { 
        
        }

        public AppointmentDto(Appointment appt)
        {
            id = appt.Id;
            companyId = appt.CompanyId;
            userId = appt.UserId;
            ownerId = appt.OwnerId;
            petId = appt.PetId;
            title = appt.Title;
            description = appt.Description;
            start = appt.Start;
            end = appt.End;
        }
        public int id { get; set; }
        public int? companyId { get; set; }
        public string? userId {get;set;}
        public int? ownerId { get; set; }
        public int? petId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
    }
}
