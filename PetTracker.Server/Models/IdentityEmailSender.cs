using Azure.Core;
using Microsoft.AspNetCore.Identity;
using PetTracker.Domain.Models;
using System.Net;
using System.Net.Mail;

namespace PetTracker.Server.Models
{
    public class IdentityEmailSender : IEmailSender<AspNetUser>
    {
        public async Task SendConfirmationLinkAsync(AspNetUser user, string email, string confirmationLink)
        {
            var fromAddress = new MailAddress("PetTrackerFriend@gmail.com", "Pet Tracker");
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

            var body = $"Welcome to PetTracker! Please confirm your account by clicking <a href='{confirmationLink}'>here</a>";

            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = "Pet Tracker User Confirmation",
                Body = body,
                IsBodyHtml = true
            })
            {
                await smtp.SendMailAsync(message);
            }
        }

        public async Task SendPasswordResetCodeAsync(AspNetUser user, string email, string resetCode)
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
                Subject = "Pet Tracker User Reset Code",
                Body = resetCode,
                IsBodyHtml = true
            })
            {
                await smtp.SendMailAsync(message);
            }
        }

        public async Task SendPasswordResetLinkAsync(AspNetUser user, string email, string resetLink)
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
                Subject = "Pet Tracker User Reset Code",
                Body = resetLink,
                IsBodyHtml = true
            })
            {
                await smtp.SendMailAsync(message);
            }
        }
    }
}
