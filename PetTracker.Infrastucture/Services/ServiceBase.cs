using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PetTracker.SqlDb.Models;

namespace PetTracker.Infrastucture.Services
{
    public class ServiceBase
    {
        protected readonly ILogger _logger;
        protected readonly IPtDbContext _dbContext;

        public ServiceBase(ILogger logger, IPtDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
    }
}
