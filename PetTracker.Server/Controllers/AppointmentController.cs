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
        public async Task<IActionResult> GetAppointments(int? companyId)
        {
            try
            {
                var cd = DateTime.Now;
                var d1 = cd.AddDays(-2);
                var d2 = cd.AddDays(-1);
                var d3 = cd;

                //var appt1 = new AppointmentDto()
                //{
                //    id = 1,
                //    title = "Test Appointment 1",
                //    start = new DateTime(d1.Year, d1.Month, d1.Day, d1.AddHours(-1).Hour, d1.Minute, d1.Second),
                //    end = new DateTime(d1.Year, d1.Month, d1.Day, d1.Hour, d1.Minute, d1.Second)
                //};

                //var appt2 = new AppointmentDto()
                //{
                //    id = 2,
                //    title = "Test Appointment 2",
                //    start = new DateTime(d2.Year, d2.Month, d2.Day, d2.AddHours(-1).Hour, d2.Minute, d2.Second),
                //    end = new DateTime(d2.Year, d2.Month, d2.Day, d2.Hour, d2.Minute, d2.Second)
                //};

                //var appt3 = new AppointmentDto()
                //{
                //    id = 3,
                //    title = "Test Appointment 3",
                //    start = new DateTime(d3.Year, d3.Month, cd.Day, d3.AddHours(-1).Hour, d3.Minute, d3.Second),
                //    end = new DateTime(d3.Year, d3.Month, d3.Day, d3.Hour, d3.Minute, d3.Second)
                //};

                //var test = new List<AppointmentDto>()
                //{
                //    //appt1,
                //    //appt2,
                //    //appt3
                //};
                var result = await _AppointmentService.GetAppointments(companyId);
                //test.AddRange(result);
                return NewtonsoftJson(result);
            }
            catch (Exception ex)
            {
                return NewtonsoftJson(HandleUIException(ex));
            }
        }

        [HttpPost("CreateAppointment")]
        public async Task<IActionResult> CreateAppointment(AppointmentDto model)

        {
            try
            {
                var result = await _AppointmentService.CreateAppointment(model);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }

            return new JsonResult(true);
        }


        [HttpPost("UpdateAppointment")]
        public async Task<IActionResult> UpdateAppointment(AppointmentDto model)

        {
            try
            {
                var result = await _AppointmentService.UpdateAppointment(model);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, model));
            }

            return new JsonResult(true);
        }

    }
}
