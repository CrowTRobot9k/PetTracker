using PetTracker.Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public interface IAppointmentService
    {
        Task<int> CreateAppointment(AppointmentDto appointment);
        Task<int> UpdateAppointment(AppointmentDto appointment);
        Task<List<GetAppointmentDto>> GetAppointments(int? companyId = null);
        Task<int> DeleteAppointment(int appointmentId);

    }
}
