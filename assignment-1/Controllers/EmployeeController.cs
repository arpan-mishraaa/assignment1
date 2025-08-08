using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using assignment_1.Data;
using assignment_1.Models;

namespace assignment_1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly UserDbContext _context;

        public EmployeeController(UserDbContext context)
        {
            _context = context;
        }

        // CREATE - Add any employee directly (no user/email validation)
        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee employee)
        {
            try
            {
                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();
                return Ok(employee);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest($"Error saving employee: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // READ - Get all employees
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }

        //// READ - Get employee by ID
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetEmployeeById(int id)
        //{
        //    var employee = await _context.Employees.FindAsync(id);
        //    if (employee == null)
        //        return NotFound("Employee not found");

        //    return Ok(employee);
        //}

        // UPDATE - Update employee by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound("Employee not found");

            employee.Email = updatedEmployee.Email;
            employee.Name = updatedEmployee.Name;
            employee.DOB = updatedEmployee.DOB;
            employee.IsAdmin = updatedEmployee.IsAdmin;

            await _context.SaveChangesAsync();
            return Ok(employee);
        }

        // DELETE - Delete employee by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound("Employee not found");

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return Ok("Employee deleted successfully");
        }
    }
}
