using System.Data;

namespace PetTracker.Infrastucture.Services
{
    public interface IConnectionPoolMonitoringService
    {
        Task<ConnectionPoolStats> GetConnectionPoolStatsAsync();
        Task<bool> IsConnectionPoolHealthyAsync();
        Task<string> GetConnectionStringInfoAsync();
    }

    public class ConnectionPoolStats
    {
        public int ActiveConnections { get; set; }
        public int IdleConnections { get; set; }
        public int TotalConnections { get; set; }
        public int MinPoolSize { get; set; }
        public int MaxPoolSize { get; set; }
        public TimeSpan ConnectionLifetime { get; set; }
        public DateTime LastUpdated { get; set; }
        public bool IsHealthy { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
