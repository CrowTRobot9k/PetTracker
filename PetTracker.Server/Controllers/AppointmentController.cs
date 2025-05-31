using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PetTracker.Domain.DTOs;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class AppointmentController : PetTrackerBaseController
    {
        private readonly IAppointmentService _AppointmentService;

        public AppointmentController(ILogger<OwnerController> logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
            _AppointmentService = new AppointmentService(logger, dbContext);
        }

        [HttpGet("GetAppointments")]
        public async Task<IActionResult> GetAppointments()
        {
            try
            {
                var cd = DateTime.Now;
                //var test1 = new DateTime(cd.Year, cd.Month, cd.AddDays(-2).Date.Day, cd.AddHours(-1).Hour, cd.Minute, cd.Second);

                var test = new List<AppointmentDto>()
                {
                    new AppointmentDto()
                    {
                        Id = 1,
                        Title = "Test Appointment 1",
                        StartDate = new DateTime(cd.Year,cd.Month,cd.AddDays(-2).Day,cd.AddHours(-1).Hour,cd.Minute,cd.Second),
                        EndDate = new DateTime(cd.Year,cd.Month,cd.AddDays(-2).Day,cd.Hour,cd.Minute,cd.Second)
                    },
                    new AppointmentDto()
                    {
                        Id = 2,
                        Title = "Test Appointment 2",
                        StartDate = new DateTime(cd.Year,cd.Month,cd.AddDays(-1).Day,cd.AddHours(-1).Hour,cd.Minute,cd.Second),
                        EndDate = new DateTime(cd.Year,cd.Month,cd.AddDays(-1).Day,cd.Hour,cd.Minute,cd.Second)
                    },
                    new AppointmentDto()
                    {
                        Id=3,
                        Title = "Test Appointment 3",
                        StartDate = new DateTime(cd.Year,cd.Month,cd.Day,cd.AddHours(-1).Hour,cd.Minute,cd.Second),
                        EndDate = new DateTime(cd.Year,cd.Month,cd.Day,cd.Hour,cd.Minute,cd.Second)
                    },
                };
                //var result = await _AppointmentService.GetOwners();
                return NewtonsoftJson(test);
            }
            catch (Exception ex)
            {
                return NewtonsoftJson(HandleUIException(ex));
            }
        }

    }
}
