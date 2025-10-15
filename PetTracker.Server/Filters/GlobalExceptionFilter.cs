using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Net;
using System.Runtime.CompilerServices;

namespace PetTracker.Server.Filters
{
    /// <summary>
    /// Global exception filter that handles all unhandled exceptions in the application.
    /// Provides consistent error responses and logging across all controllers.
    /// </summary>
    public class GlobalExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<GlobalExceptionFilter> _logger;
        private readonly IWebHostEnvironment _environment;

        public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
        }

        public void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            var httpContext = context.HttpContext;
            
            // Get controller and action information
            var controllerName = context.RouteData.Values["controller"]?.ToString() ?? "Unknown";
            var actionName = context.RouteData.Values["action"]?.ToString() ?? "Unknown";
            
            // Serialize the request information for logging context
            string contextJson = "{}";
            try
            {
                // Try to get route values and query string parameters
                var contextData = new Dictionary<string, object?>();
                
                // Add route values
                foreach (var routeValue in context.RouteData.Values)
                {
                    if (routeValue.Key != "controller" && routeValue.Key != "action")
                    {
                        contextData[routeValue.Key] = routeValue.Value;
                    }
                }
                
                // Add query string parameters
                foreach (var queryParam in httpContext.Request.Query)
                {
                    contextData[$"query_{queryParam.Key}"] = queryParam.Value.ToString();
                }
                
                contextJson = JsonConvert.SerializeObject(contextData);
            }
            catch
            {
                // If serialization fails, use empty object
                contextJson = "{}";
            }

            // Log the exception with full context
            _logger.LogError(
                exception,
                "{ActionName} in {ControllerName}Controller, context={Context}",
                actionName,
                controllerName,
                contextJson
            );

            // Determine the error message to return to the client
            var errorMessage = GetDefaultErrorMessage();
            
            // In development, optionally include exception details
            if (_environment.IsDevelopment())
            {
                // Uncomment the line below to show detailed errors in development
                // errorMessage = $"Error in {actionName} ({controllerName}Controller), context={contextJson}, Error: {exception}";
            }

            // Handle specific exception types differently if needed
            var statusCode = exception switch
            {
                OutOfMemoryException => HttpStatusCode.InsufficientStorage,
                UnauthorizedAccessException => HttpStatusCode.Unauthorized,
                ArgumentException => HttpStatusCode.BadRequest,
                KeyNotFoundException => HttpStatusCode.NotFound,
                _ => HttpStatusCode.InternalServerError
            };

            // Set the response
            context.Result = new JsonResult(errorMessage)
            {
                StatusCode = (int)statusCode
            };

            // Mark the exception as handled
            context.ExceptionHandled = true;
        }

        private string GetDefaultErrorMessage()
        {
            return "The system encountered an error while processing your request. " +
                   "We are working to resolve the issue as soon as possible. Please try again later. " +
                   "Thank you for your patience.";
        }
    }
}
