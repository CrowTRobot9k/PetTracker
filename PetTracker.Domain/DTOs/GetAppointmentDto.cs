using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class GetAppointmentDto:AppointmentDto
    {
        public GetAppointmentDto(Appointment appointment):base(appointment)
        {

            if (appointment?.Owner != null)
            {
                ownerId = appointment.Owner.Id;
                firstName = appointment.Owner.FirstName;
                lastName = appointment.Owner.LastName;
            }

            if (appointment?.Pet != null)
            {
                petId = appointment.Pet.Id;
                petName = appointment.Pet.Name;
            }            
        }
        public string? firstName { get; set; } = null!;
        public string? lastName { get; set; } = null!;
        public string? owner => $"{firstName} {lastName}"?.Trim();
        public string? petName { get; set; }
    }
}
