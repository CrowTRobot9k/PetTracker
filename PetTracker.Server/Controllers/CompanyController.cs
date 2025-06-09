using Microsoft.AspNetCore.Mvc;
using PetTracker.Infrastucture.Services;
using PetTracker.SqlDb.Models;

namespace PetTracker.Server.Controllers
{
    public class CompanyController : PetTrackerBaseController
    {
        private readonly ICompanyService _UserService;
        public CompanyController(ILogger<CompanyController> logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
            _UserService = new CompanyService(logger, dbContext);
        }

        [HttpGet("GetCompanies")]
        public async Task<IActionResult> GetCompanies(int? companyId)
        {
            try
            {
                var result = await _UserService.GetCompanies(companyId);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(HandleUIException(ex));
            }
        }
    }
}
