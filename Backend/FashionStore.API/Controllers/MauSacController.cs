
using FashionStore.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/mau-sac")]
    public class MauSacController : ControllerBase
    {
        private readonly IMauSacService _service;

        public MauSacController(IMauSacService service)
        {
            _service = service;
        }

        // GET: api/v1/mau-sac

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> LayDanhSach(
            CancellationToken cancellationToken)
        {
            var ketQua = await _service.LayDanhSachAsync(
                false,
                cancellationToken
            );

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }
    }
}
