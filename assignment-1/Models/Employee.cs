using System.ComponentModel.DataAnnotations;

namespace assignment_1.Models
{
    public class Employee
    {
        [Key]
        [Required]
        public int EmpId { get; set; } // Now manually provided

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime DOB { get; set; }

        [Required]
        public bool IsAdmin { get; set; }
    }
}
