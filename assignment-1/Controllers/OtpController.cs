using assignment_1.Data;
using assignment_1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace assignment_1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private readonly UserDbContext _context;

        public OtpController(UserDbContext context)
        {
            _context = context;
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestOtp([FromBody] string email)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == email);
            if (!userExists)
                return BadRequest("User does not exist.");

            var now = DateTime.UtcNow;
            var windowStart = now.AddMinutes(-15);

            var recentOtps = await _context.OtpVerifications
                .Where(o => o.Email == email && o.OtpGeneratedAt >= windowStart)
                .ToListAsync();

            if (recentOtps.Count >= 5)
            {
                var firstOtpTime = recentOtps.Min(o => o.OtpGeneratedAt);
                var retryAfter = (firstOtpTime.AddMinutes(15) - now).TotalSeconds;
                return BadRequest($"Too many OTP requests. Please wait {retryAfter:F0} seconds.");
            }

            var lastOtp = recentOtps.OrderByDescending(o => o.OtpGeneratedAt).FirstOrDefault();
            if (lastOtp != null && lastOtp.OtpGeneratedAt.AddMinutes(2) > now)
            {
                var remaining = (lastOtp.OtpGeneratedAt.AddMinutes(2) - now).TotalSeconds;
                return BadRequest($"OTP already sent. Try again after {remaining:F0} seconds.");
            }

            string otp = new Random().Next(100000, 999999).ToString();

            _context.OtpVerifications.Add(new OtpVerification
            {
                Email = email,
                OtpCode = otp,
                OtpGeneratedAt = now
            });

            await _context.SaveChangesAsync();
            return Ok($"OTP generated for {email}.\n {otp}");
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpRequest model)
        {
            var now = DateTime.UtcNow;
            var otpEntry = await _context.OtpVerifications
                .Where(o => o.Email == model.Email && o.OtpCode == model.Otp)
                .OrderByDescending(o => o.OtpGeneratedAt)
                .FirstOrDefaultAsync();

            if (otpEntry == null)
                return BadRequest("Invalid OTP or email.");

            if (otpEntry.OtpGeneratedAt.AddMinutes(2) < now)
                return BadRequest("OTP expired.");

            return Ok("OTP verified successfully.");
        }

        public class OtpRequest
        {
            [Required]
            public string Email { get; set; } = string.Empty;

            [Required]
            public string Otp { get; set; } = string.Empty;
        }
    }
}
