using System.ComponentModel.DataAnnotations;

namespace assignment_1.Models
{
    public class OtpVerification
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string? OtpCode { get; set; }

        [Required]
        public DateTime OtpGeneratedAt { get; set; }
    }
}
