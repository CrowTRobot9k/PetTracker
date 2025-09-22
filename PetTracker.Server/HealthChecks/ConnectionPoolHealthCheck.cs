using Microsoft.Extensions.Diagnostics.HealthChecks;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.HealthChecks
{
    public class ConnectionPoolHealthCheck : IHealthCheck
    {
        private readonly IPtDbContext _dbContext;

        public ConnectionPoolHealthCheck(IPtDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                // Simple query to test connection
                var canConnect = await _dbContext.Database.CanConnectAsync(cancellationToken);
                
                if (canConnect)
                {
                    return HealthCheckResult.Healthy("Database connection pool is healthy");
                }
                else
                {
                    return HealthCheckResult.Unhealthy("Database connection pool is unhealthy");
                }
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy($"Database connection pool error: {ex.Message}", ex);
            }
        }
    }
}
