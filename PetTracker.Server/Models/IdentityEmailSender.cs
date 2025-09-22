using Azure.Core;
using Microsoft.AspNetCore.Identity;
using PetTracker.Domain.Models;
using PetTracker.Infrastucture.Services;
using System.Net;
using System.Net.Mail;

namespace PetTracker.Server.Models
{
    public class IdentityEmailSender : ICustomEmailSender
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

        public async Task SendTemporaryPasswordAsync(AspNetUser user, string email, string temporaryPassword, string confirmationLink)
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

            var body = $@"
                <html>
                <body>
                    <h2>Welcome to Pet Tracker!</h2>
                    <p>Your account has been created successfully. Please use the following temporary password to access your account:</p>
                    <p><strong>Temporary Password: {temporaryPassword}</strong></p>
                    <p>For security reasons, you will be required to change this password on your first login.</p>
                    <p>Please confirm your email address by clicking the link below:</p>
                    <p><a href='{confirmationLink}' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Confirm Email Address</a></p>
                    <p>If you cannot click the link, copy and paste this URL into your browser:</p>
                    <p>{confirmationLink}</p>
                    <br>
                    <p>Best regards,<br>Pet Tracker Team</p>
                </body>
                </html>";

            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = "Pet Tracker - Account Created with Temporary Password",
                Body = body,
                IsBodyHtml = true
            })
            {
                await smtp.SendMailAsync(message);
            }
        }
    }
}
