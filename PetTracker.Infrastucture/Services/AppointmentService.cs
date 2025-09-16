using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetTracker.Domain.DTOs;
using PetTracker.Domain.Models;
using PetTracker.SqlDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public class AppointmentService : ServiceBase<AppointmentService>, IAppointmentService
    {
        public AppointmentService(ILogger<AppointmentService> logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }

        public async Task<int> CreateAppointment(AppointmentDto appointment) 
        {
            var addAppointment = new Appointment(appointment);

            await _dbContext.Appointments.AddAsync(addAppointment);
            await _dbContext.SaveChangesAsync();

            return addAppointment.Id;
        }
        public async Task<List<GetAppointmentDto>> GetAppointments(int? companyId = null)
        {
            var results = await _dbContext.Appointments
                .Include(a => a.Owner)
                .Include(a => a.Pet)
                    .ThenInclude(p => p.PetType)
                .Include(a => a.Pet)
                    .ThenInclude(p => p.PetBreedTypes)
                        .ThenInclude(pbt => pbt.BreedType)
                .Where(w => companyId == null || w.CompanyId == companyId)
                .ToListAsync();

            if (results == null || !results.Any())
            {
                return new List<GetAppointmentDto>();
            }

            return results.Select(s => new GetAppointmentDto(s)).ToList();
        }

        public async Task<int> UpdateAppointment(AppointmentDto appointment)
        { 
            var existingAppointment = await _dbContext.Appointments
                .Include(a => a.Owner)
                .Include(a => a.Pet)
                .FirstOrDefaultAsync(a => a.Id == appointment.id);
            if (existingAppointment == null)
            {
                throw new KeyNotFoundException($"Appointment with ID {appointment.id} not found.");
            }

            existingAppointment.UpdateAppointment(appointment);
            await _dbContext.SaveChangesAsync();

            return existingAppointment.Id;
        }

        public async Task<int> DeleteAppointment(int appointmentId)
        {
           return await _dbContext.Appointments.Where(w => w.Id == appointmentId).ExecuteDeleteAsync();
        }
    }
}
