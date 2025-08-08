using Microsoft.AspNetCore.Mvc;
using assignment_1.Data;
using assignment_1.Models;
using Microsoft.EntityFrameworkCore;

namespace assignment_1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserDbContext _context;

        public UserController(UserDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                return BadRequest("User with this email already exists.");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
    }
}
