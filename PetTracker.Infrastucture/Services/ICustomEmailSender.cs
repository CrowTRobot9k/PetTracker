using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using PetTracker.Domain.Models;

namespace PetTracker.Infrastucture.Services
{
    public interface ICustomEmailSender : IEmailSender<AspNetUser>
    {
        Task SendTemporaryPasswordAsync(AspNetUser user, string email, string temporaryPassword, string confirmationLink);
    }
}
