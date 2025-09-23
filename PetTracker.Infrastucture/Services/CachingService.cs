using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;

namespace PetTracker.Infrastucture.Services
{
    public class CachingService : ICachingService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<CachingService> _logger;
        private readonly TimeSpan _defaultExpiration = TimeSpan.FromMinutes(30);

        public CachingService(IMemoryCache memoryCache, ILogger<CachingService> logger)
        {
            _memoryCache = memoryCache;
            _logger = logger;
        }

        public Task<T?> GetAsync<T>(string key) where T : class
        {
            try
            {
                if (_memoryCache.TryGetValue(key, out T? cachedValue))
                {
                    _logger.LogDebug("Cache hit for key: {Key}", key);
                    return Task.FromResult(cachedValue);
                }

                _logger.LogDebug("Cache miss for key: {Key}", key);
                return Task.FromResult<T?>(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving from cache for key: {Key}", key);
                return Task.FromResult<T?>(null);
            }
        }

        public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
        {
            try
            {
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = expiration ?? _defaultExpiration,
                    Priority = CacheItemPriority.Normal,
                    Size = 1 // Each entry counts as 1 unit toward the size limit
                };

                _memoryCache.Set(key, value, cacheOptions);
                _logger.LogDebug("Cached value for key: {Key} with expiration: {Expiration}", key, expiration ?? _defaultExpiration);
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting cache for key: {Key}", key);
                return Task.CompletedTask;
            }
        }

        public Task RemoveAsync(string key)
        {
            try
            {
                _memoryCache.Remove(key);
                _logger.LogDebug("Removed cache entry for key: {Key}", key);
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing cache for key: {Key}", key);
                return Task.CompletedTask;
            }
        }

        public Task RemoveByPatternAsync(string pattern)
        {
            try
            {
                // Note: IMemoryCache doesn't support pattern-based removal natively
                // This is a limitation of the built-in memory cache
                // In a production scenario, consider using Redis or a more advanced caching solution
                _logger.LogWarning("Pattern-based cache removal not supported with IMemoryCache. Pattern: {Pattern}", pattern);
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing cache by pattern: {Pattern}", pattern);
                return Task.CompletedTask;
            }
        }

        public Task<bool> ExistsAsync(string key)
        {
            try
            {
                return Task.FromResult(_memoryCache.TryGetValue(key, out _));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking cache existence for key: {Key}", key);
                return Task.FromResult(false);
            }
        }
    }
}
