using Microsoft.AspNetCore.Mvc;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class CompanyController : PetTrackerBaseController
    {
        private readonly ICompanyService _UserService;
        private readonly ICachingService _cachingService;
        
        public CompanyController(ILogger<CompanyController> logger, IPtDbContext dbContext, ICompanyService companyService, ICachingService cachingService) : base(logger, dbContext)
        {
            _UserService = companyService;
            _cachingService = cachingService;
        }

        [HttpGet("GetCompanies")]
        public async Task<IActionResult> GetCompanies(int? companyId)
        {
            try
            {
                // Create cache key based on companyId parameter
                var cacheKey = $"companies_{companyId?.ToString() ?? "all"}";
                
                // Try to get from cache first
                var cachedResult = await _cachingService.GetAsync<object>(cacheKey);
                if (cachedResult != null)
                {
                    return new JsonResult(cachedResult);
                }
                
                // If not in cache, fetch from database
                var result = await _UserService.GetCompanies(companyId);
                
                // Cache the result for 1 hour
                await _cachingService.SetAsync(cacheKey, result, TimeSpan.FromHours(1));
                
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }
    }
}
