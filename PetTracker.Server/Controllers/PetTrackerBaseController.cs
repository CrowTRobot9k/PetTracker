using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PetTracker.SqlDb.Models;
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
            return "Sorry, the system encountered error message while processing your request. " +
                    "We are working to resolve the issue as soon as possible. Please try again later. " +
                    "If the issue persists, please send a service ticket through our in application support system located at the bottom of the page. Thank you for your patience.";
        }

        protected string HandleUIException(Exception ex = null, object context = null, [CallerMemberName] string callerName = "", [CallerFilePath] string callerFilePath = "", [CallerLineNumber] int callerLineNumber = 0)
        {
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
    }
}
