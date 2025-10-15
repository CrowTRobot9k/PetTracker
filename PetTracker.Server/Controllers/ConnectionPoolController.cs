using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetTracker.Domain.Models;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator")] // Only administrators can access connection pool monitoring
    public class ConnectionPoolController : PetTrackerBaseController
    {
        private readonly IConnectionPoolMonitoringService _connectionPoolMonitoringService;

        public ConnectionPoolController(
            ILogger<ConnectionPoolController> logger, 
            IPtDbContext dbContext,
            IConnectionPoolMonitoringService connectionPoolMonitoringService) 
            : base(logger, dbContext)
        {
            _connectionPoolMonitoringService = connectionPoolMonitoringService;
        }

        /// <summary>
        /// Gets detailed connection pool statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetConnectionPoolStats()
        {
            var stats = await _connectionPoolMonitoringService.GetConnectionPoolStatsAsync();
            return Ok(stats);
        }

        /// <summary>
        /// Checks if the connection pool is healthy
        /// </summary>
        [HttpGet("health")]
        public async Task<IActionResult> GetConnectionPoolHealth()
        {
            var isHealthy = await _connectionPoolMonitoringService.IsConnectionPoolHealthyAsync();
            return Ok(new { isHealthy, status = isHealthy ? "Healthy" : "Unhealthy" });
        }

        /// <summary>
        /// Gets connection string configuration information (without sensitive data)
        /// </summary>
        [HttpGet("config")]
        public async Task<IActionResult> GetConnectionStringConfig()
        {
            var config = await _connectionPoolMonitoringService.GetConnectionStringInfoAsync();
            return Ok(new { configuration = config });
        }
    }
}
