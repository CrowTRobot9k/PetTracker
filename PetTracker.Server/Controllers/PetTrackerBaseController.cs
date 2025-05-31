using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PetTracker.SqlDb.Models;
using System.Net;
using System.Runtime.CompilerServices;


namespace PetTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetTrackerBaseController : ControllerBase
    {
        protected readonly ILogger _logger;
        protected readonly IPtDbContext _dbContext;

        public PetTrackerBaseController(ILogger logger, IPtDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        protected string GetDefaultErrorMessage()
        {
            return "The system encountered an error while processing your request. " +
                    "We are working to resolve the issue as soon as possible. Please try again later. " +
                    "Thank you for your patience.";
        }

        protected string HandleUIException(Exception ex = null, object context = null, [CallerMemberName] string callerName = "", [CallerFilePath] string callerFilePath = "", [CallerLineNumber] int callerLineNumber = 0, bool returnErrorStatus = true)
        {
            if (returnErrorStatus)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }

            var showExceptions = false;

            var contextJson = JsonConvert.SerializeObject(context);

            var defaultErrorMessage = GetDefaultErrorMessage();

            if (null != ex)
            {
                _logger.LogError($"{callerName} (in {callerFilePath}:line {callerLineNumber}), context={contextJson}, Error:{ex.ToString()}");
                if (showExceptions)
                {
                    defaultErrorMessage = $"Error Occured: {callerName} (in {callerFilePath}:line {callerLineNumber}), context={contextJson}, Error:{ex.ToString()}";
                }
            }

            return defaultErrorMessage;
        }

        [NonAction]
        public ActionResult NewtonsoftJson(object obj)
        {
            var json = JsonConvert.SerializeObject(obj);

            return Content(json, "application/json");
        }
    }
}
