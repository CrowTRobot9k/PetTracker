using Microsoft.Extensions.Logging;
using PetTracker.SqlDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Infrastucture.Services
{
    public class AppointmentService : ServiceBase,IAppointmentService
    {
        public AppointmentService(ILogger logger, IPtDbContext dbContext) : base(logger, dbContext)
        {
        }
    }
}
