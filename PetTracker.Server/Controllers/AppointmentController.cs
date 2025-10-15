using Microsoft.AspNetCore.Authorization;
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

        public AppointmentController(ILogger<OwnerController> logger, IPtDbContext dbContext, IAppointmentService appointmentService) : base(logger, dbContext)
        {
            _AppointmentService = appointmentService;
        }

        [HttpGet("GetAppointments")]
        [Authorize(Roles = "Administrator,Appointments Read,Appointments Write")]
        public async Task<IActionResult> GetAppointments(int? companyId)
        {
            var result = await _AppointmentService.GetAppointments(companyId);
            return NewtonsoftJson(result);
        }

        [HttpPost("CreateAppointment")]
        [Authorize(Roles = "Administrator,Appointments Write")]
        public async Task<IActionResult> CreateAppointment(AppointmentDto model)
        {
            var result = await _AppointmentService.CreateAppointment(model);
            return new JsonResult(true);
        }


        [HttpPost("UpdateAppointment")]
        [Authorize(Roles = "Administrator,Appointments Write")]
        public async Task<IActionResult> UpdateAppointment(AppointmentDto model)
        {
            var result = await _AppointmentService.UpdateAppointment(model);
            return new JsonResult(true);
        }


        [HttpPost("DeleteAppointment")]
        [Authorize(Roles = "Administrator,Appointments Write")]
        public async Task<IActionResult> DeleteAppointment([FromBody] int id)
        {
            var result = await _AppointmentService.DeleteAppointment(id);
            return new JsonResult(true);
        }

    }
}
