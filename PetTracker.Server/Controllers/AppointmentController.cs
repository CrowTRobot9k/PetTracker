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
                var result = await _AppointmentService.GetAppointments(companyId);

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


        [HttpPost("DeleteAppointment")]
        public async Task<IActionResult> DeleteAppointment([FromBody] int id)
        {
            try
            {
                var result = await _AppointmentService.DeleteAppointment(id);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex, id));
            }

            return new JsonResult(true);
        }

    }
}
