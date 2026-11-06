
using FashionStore.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/thuong-hieu")]
    public class ThuongHieuController : ControllerBase
    {
        private readonly IThuongHieuService _service;

        public ThuongHieuController(IThuongHieuService service)
        {
            _service = service;
        }

        // GET: api/v1/thuong-hieu

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

        // GET: api/v1/thuong-hieu/{slug}

        [HttpGet("{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> LayTheoSlug(
            string slug,
            CancellationToken cancellationToken)
        {
            var ketQua = await _service.LayTheoSlugAsync(
                slug,
                cancellationToken
            );

            if (ketQua == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy thương hiệu."
                });
            }

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }
    }
}
