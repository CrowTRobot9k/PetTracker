namespace PetTracker.Domain.Models
{
    public class DatabaseSettings
    {
        public const string SectionName = "DatabaseSettings";
        
        public ConnectionPoolingSettings ConnectionPooling { get; set; } = new();
    }

    public class ConnectionPoolingSettings
    {
        public bool Enabled { get; set; } = true;
        public int MinPoolSize { get; set; } = 5;
        public int MaxPoolSize { get; set; } = 100;
        public int ConnectionLifetime { get; set; } = 300; // seconds
        public int ConnectionIdleLifetime { get; set; } = 600; // seconds
        public int CommandTimeout { get; set; } = 30; // seconds
        public bool EnableRetryOnFailure { get; set; } = true;
        public int MaxRetryCount { get; set; } = 3;
        public TimeSpan MaxRetryDelay { get; set; } = TimeSpan.FromSeconds(30);
    }
}
