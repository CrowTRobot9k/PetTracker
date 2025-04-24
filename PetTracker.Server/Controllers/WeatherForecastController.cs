using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        public readonly IPtDbContext _dbContext;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IPtDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpGet("GetWeatherForecast")]
        public async Task<IEnumerable<WeatherForecast>> GetWeatherForecast()
        {
            try
            {
                return Enumerable.Range(1, 5).Select(index => new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
                })
                .ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting the weather forecast.");
                throw;
            }
        }

        [HttpGet("NewWeather")]
        public async Task<string> GetNewWeather()
        {
            try
            {
                return "Test";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting the weather forecast.");
                throw;
            }
        }
    }
}
