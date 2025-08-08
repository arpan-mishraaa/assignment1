using Microsoft.EntityFrameworkCore;
using assignment_1.Models;

namespace assignment_1.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<OtpVerification> OtpVerifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("user");
            modelBuilder.Entity<Employee>().ToTable("employee");
            modelBuilder.Entity<OtpVerification>().ToTable("otpverification");
        }
    }
}
