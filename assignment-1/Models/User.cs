using System.ComponentModel.DataAnnotations;

namespace assignment_1.Models
{
    public class User
    {
        [Key]
        [Required]
        public string UID { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
