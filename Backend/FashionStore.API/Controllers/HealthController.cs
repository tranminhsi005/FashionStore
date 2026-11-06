using FashionStore.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/health")]
    public class HealthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<HealthController> _logger;

        public HealthController(
            AppDbContext context,
            ILogger<HealthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult KiemTraHeThong()
        {
            return Ok(new
            {
                success = true,
                message = "FashionStore API is running.",
                timestampUtc = DateTimeOffset.UtcNow
            });
        }

        [HttpGet("database")]
        public async Task<IActionResult> KiemTraDatabase(
            CancellationToken cancellationToken)
        {
            try
            {
                bool ketNoiDuoc = await _context.Database
                    .CanConnectAsync(cancellationToken);

                if (!ketNoiDuoc)
                {
                    return StatusCode(503, new
                    {
                        success = false,
                        message = "Khong the ket noi PostgreSQL."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Ket noi PostgreSQL thanh cong."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Loi khi kiem tra ket noi PostgreSQL."
                );

                return StatusCode(503, new
                {
                    success = false,
                    message = "Database hien khong kha dung."
                });
            }
        }
    }
}
