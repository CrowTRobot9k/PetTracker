using Humanizer;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net;
using System.Net.Mail;

namespace PetTracker.Server.Models
{
    public class EmailSender:IEmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var fromAddress = new MailAddress("PetTrackerFriend@gmail.com", "Peter Mathieu");
            var toAddress = new MailAddress(email, email);

            const string fromPassword = "iqnf aipm gguc mbfx ";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            })
            {
               await smtp.SendMailAsync(message);
            }
        }
    }
}
