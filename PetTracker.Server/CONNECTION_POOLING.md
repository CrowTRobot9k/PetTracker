# Connection Pooling Implementation

This document describes the connection pooling implementation for the PetTracker application.

## Overview

Connection pooling has been implemented to improve database performance and scalability by reusing database connections instead of creating new ones for each request.

## Configuration

### Connection String Parameters

The connection string includes the following pooling parameters:

```
Pooling=true                    # Enables connection pooling
Min Pool Size=5                 # Minimum connections in pool
Max Pool Size=100               # Maximum connections in pool
Connection Lifetime=300         # Connection lifetime in seconds
Connection Timeout=30           # Connection timeout in seconds
```

### AppSettings Configuration

Connection pooling settings are configured in `appsettings.json`:

```json
{
  "DatabaseSettings": {
    "ConnectionPooling": {
      "Enabled": true,
      "MinPoolSize": 5,
      "MaxPoolSize": 100,
      "ConnectionLifetime": 300,
      "ConnectionIdleLifetime": 600,
      "CommandTimeout": 30,
      "EnableRetryOnFailure": true,
      "MaxRetryCount": 3,
      "MaxRetryDelay": "00:00:30"
    }
  }
}
```

## Environment-Specific Settings

### Development
- Min Pool Size: 2
- Max Pool Size: 20
- Optimized for development workloads

### Production
- Min Pool Size: 10
- Max Pool Size: 200
- Optimized for production workloads with higher concurrency

## Monitoring

### Health Check Endpoints

The application provides several health check endpoints:

- `/health` - Comprehensive health check including connection pool status
- `/health/ready` - Readiness probe for container orchestration
- `/health/live` - Liveness probe for container orchestration

### Connection Pool Monitoring API

Administrators can monitor connection pool statistics via the API:

- `GET /api/ConnectionPool/stats` - Detailed connection pool statistics
- `GET /api/ConnectionPool/health` - Connection pool health status
- `GET /api/ConnectionPool/config` - Connection string configuration

### Example Response

```json
{
  "activeConnections": 15,
  "idleConnections": 5,
  "totalConnections": 20,
  "minPoolSize": 10,
  "maxPoolSize": 200,
  "connectionLifetime": "00:05:00",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "isHealthy": true,
  "status": "Healthy"
}
```

## Best Practices

### Service Lifetime
- DbContext is registered as `Scoped` to ensure one context per request
- This allows for optimal connection reuse within the scope of a request

### Connection Management
- Connections are automatically managed by the SQL Server driver
- No manual connection management is required in application code
- Connections are returned to the pool when the DbContext is disposed

### Performance Considerations
- Monitor connection pool utilization regularly
- Adjust MinPoolSize and MaxPoolSize based on actual usage patterns
- Use connection lifetime settings to prevent long-running connections

### Error Handling
- Retry logic is configured for transient failures
- Connection pool monitoring provides early warning of issues
- Health checks enable automatic recovery in containerized environments

## Troubleshooting

### Common Issues

1. **Connection Pool Exhaustion**
   - Increase MaxPoolSize
   - Check for connection leaks in application code
   - Monitor connection lifetime settings

2. **Slow Connection Establishment**
   - Reduce Connection Timeout for faster failure detection
   - Increase MinPoolSize to maintain warm connections

3. **High Memory Usage**
   - Reduce MaxPoolSize
   - Decrease Connection Lifetime
   - Monitor idle connection count

### Monitoring Commands

```bash
# Check connection pool health
curl https://your-api/health

# Get detailed statistics
curl https://your-api/api/ConnectionPool/stats

# Check configuration
curl https://your-api/api/ConnectionPool/config
```

## Performance Benefits

1. **Reduced Connection Overhead**: Reusing connections eliminates the cost of establishing new connections
2. **Improved Response Times**: Pre-established connections provide faster database access
3. **Better Resource Utilization**: Connection pooling prevents resource exhaustion
4. **Scalability**: Supports higher concurrent user loads with fewer database resources

## Security Considerations

- Connection pool monitoring endpoints are restricted to administrators only
- Sensitive connection string information is filtered in monitoring responses
- All database communications use encrypted connections (Encrypt=True)

## Project Structure

The connection pooling implementation follows proper separation of concerns:

- `PetTracker.Domain/Models/DatabaseSettings.cs` - Configuration model (Domain layer)
- `PetTracker.Infrastructure/Services/ConnectionPoolMonitoringService.cs` - Monitoring service (Infrastructure layer)
- `PetTracker.Server/Controllers/ConnectionPoolController.cs` - API endpoints (Server layer)
- `PetTracker.Server/appsettings.*.json` - Environment-specific configurations
