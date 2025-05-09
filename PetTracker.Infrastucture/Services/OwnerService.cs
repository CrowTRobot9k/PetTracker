using Microsoft.Extensions.Logging;
using PetTracker.SqlDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public class OwnerService : ServiceBase, IOwnerService
    {
        public OwnerService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }
    }
}
