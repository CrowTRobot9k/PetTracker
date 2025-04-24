namespace PetTracker.Server.Models
{
    public class CustomRegisterRequest
    {
        public required string Email { get; init; }

        public required string Password { get; init; }
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public int? CompanyId { get; init; }
        public int? CompanyCode { get; set; }
    }
}
