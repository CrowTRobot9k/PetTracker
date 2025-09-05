using System.ComponentModel.DataAnnotations;

namespace PetTracker.Server.Models
{
    public class CustomRegisterRequest
    {
        [Required]
        [EmailAddress]
        public required string Email { get; init; }

        [Required]
        [MinLength(6)]
        public required string Password { get; init; }
        
        [Required]
        public required string FirstName { get; init; }
        
        [Required]
        public required string LastName { get; init; }
        
        public int? CompanyId { get; init; }
        public int? CompanyCode { get; set; }
    }
}
