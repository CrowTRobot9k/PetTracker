using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using PetTracker.Domain.Models;
using PetTracker.SqlDb.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace PetTracker.Infrastucture.Services
{
    public class ConnectionPoolMonitoringService : IConnectionPoolMonitoringService
    {
        private readonly IPtDbContext _dbContext;
        private readonly DatabaseSettings _databaseSettings;
        private readonly ILogger<ConnectionPoolMonitoringService> _logger;

        public ConnectionPoolMonitoringService(
            IPtDbContext dbContext,
            IOptions<DatabaseSettings> databaseSettings,
            ILogger<ConnectionPoolMonitoringService> logger)
        {
            _dbContext = dbContext;
            _databaseSettings = databaseSettings.Value;
            _logger = logger;
        }

        public async Task<ConnectionPoolStats> GetConnectionPoolStatsAsync()
        {
            try
            {
                var stats = new ConnectionPoolStats
                {
                    MinPoolSize = _databaseSettings.ConnectionPooling.MinPoolSize,
                    MaxPoolSize = _databaseSettings.ConnectionPooling.MaxPoolSize,
                    ConnectionLifetime = TimeSpan.FromSeconds(_databaseSettings.ConnectionPooling.ConnectionLifetime),
                    LastUpdated = DateTime.UtcNow
                };

                // Get connection pool statistics from SQL Server
                var connectionString = _dbContext.Database.GetDbConnection().ConnectionString;
                if (!string.IsNullOrEmpty(connectionString))
                {
                    using var connection = new SqlConnection(connectionString);
                    await connection.OpenAsync();

                    // Query SQL Server for connection pool information
                    var query = @"
                        SELECT 
                            COUNT(*) as ActiveConnections,
                            (SELECT COUNT(*) FROM sys.dm_exec_connections WHERE state = 'sleeping') as IdleConnections
                        FROM sys.dm_exec_connections 
                        WHERE state = 'connected'";

                    using var command = new SqlCommand(query, connection);
                    using var reader = await command.ExecuteReaderAsync();

                    if (await reader.ReadAsync())
                    {
                        stats.ActiveConnections = reader.GetInt32("ActiveConnections");
                        stats.IdleConnections = reader.GetInt32("IdleConnections");
                        stats.TotalConnections = stats.ActiveConnections + stats.IdleConnections;
                    }

                    await connection.CloseAsync();
                }

                // Determine health status
                stats.IsHealthy = stats.TotalConnections <= stats.MaxPoolSize && stats.TotalConnections >= stats.MinPoolSize;
                stats.Status = stats.IsHealthy ? "Healthy" : "Unhealthy";

                return stats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving connection pool statistics");
                return new ConnectionPoolStats
                {
                    IsHealthy = false,
                    Status = $"Error: {ex.Message}",
                    LastUpdated = DateTime.UtcNow
                };
            }
        }

        public async Task<bool> IsConnectionPoolHealthyAsync()
        {
            try
            {
                var stats = await GetConnectionPoolStatsAsync();
                return stats.IsHealthy;
            }
            catch
            {
                return false;
            }
        }

        public Task<string> GetConnectionStringInfoAsync()
        {
            try
            {
                var connectionString = _dbContext.Database.GetDbConnection().ConnectionString;
                if (string.IsNullOrEmpty(connectionString))
                {
                    return Task.FromResult("No connection string available");
                }

                // Parse connection string to extract relevant information (without sensitive data)
                var builder = new SqlConnectionStringBuilder(connectionString);
                
                var result = $@"Server: {builder.DataSource}
Database: {builder.InitialCatalog}
Pooling: {builder.Pooling}
Min Pool Size: {builder.MinPoolSize}
Max Pool Size: {builder.MaxPoolSize}
Connection Timeout: {builder.ConnectTimeout}
Connection Lifetime: {builder.LoadBalanceTimeout}
Multiple Active Result Sets: {builder.MultipleActiveResultSets}
Encrypt: {builder.Encrypt}";

                return Task.FromResult(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving connection string information");
                return Task.FromResult($"Error: {ex.Message}");
            }
        }
    }
}
