using PetTracker.Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.Models
{
    public class Appointment
    {
        public Appointment()
        {
        }
        public Appointment(AppointmentDto appt)
        {
            Id = appt.id;
            CompanyId = appt.companyId;
            UserId = appt.userId;
            OwnerId = appt.ownerId;
            PetId = appt.petId;
            Title = appt.title;
            Description = appt.description;
            Start = appt.start;
            End = appt.end;
        }

        public void UpdateAppointment(AppointmentDto appt)
        {
            CompanyId = appt.companyId;
            UserId = appt.userId;
            OwnerId = appt.ownerId;
            PetId = appt.petId;
            Title = appt.title;
            Description = appt.description;
            Start = appt.start;
            End = appt.end;
        }
        public int Id { get; set; }
        public int? CompanyId { get; set; }
        public string? UserId { get; set; }
        public int? OwnerId { get; set; }
        public int? PetId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public virtual Owner? Owner { get; set; }
        public virtual Pet? Pet { get; set; }
        //public virtual AspNetUser? User { get; set; }
    }
}
