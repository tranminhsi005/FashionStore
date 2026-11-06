
using FashionStore.API.DTOs.Products;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/san-pham")]
    [AllowAnonymous]
    public class ProductsController : ControllerBase
    {
        private readonly ISanPhamService _service;

        public ProductsController(ISanPhamService service)
        {
            _service = service;
        }

        // =============================================
        // GET: api/v1/san-pham
        // DANH SACH SAN PHAM
        // =============================================

        [HttpGet]
        public async Task<IActionResult> LayDanhSach(
            [FromQuery] SanPhamQueryDto query,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _service.LayDanhSachCongKhaiAsync(
                    query,
                    cancellationToken
                );

                return Ok(new
                {
                    success = true,
                    data = ketQua
                });
            }
            catch (CatalogServiceException ex)
            {
                return StatusCode(ex.StatusCode, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // =============================================
        // GET: api/v1/san-pham/noi-bat
        // SAN PHAM NOI BAT
        // =============================================

        [HttpGet("noi-bat")]
        public async Task<IActionResult> LayNoiBat(
            [FromQuery] int soLuong = 8,
            CancellationToken cancellationToken = default)
        {
            var ketQua = await _service.LaySanPhamNoiBatAsync(
                soLuong,
                cancellationToken
            );

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }

        // =============================================
        // GET: api/v1/san-pham/moi-nhat
        // SAN PHAM MOI NHAT
        // =============================================

        [HttpGet("moi-nhat")]
        public async Task<IActionResult> LayMoiNhat(
            [FromQuery] int soLuong = 8,
            CancellationToken cancellationToken = default)
        {
            var ketQua = await _service.LaySanPhamMoiNhatAsync(
                soLuong,
                cancellationToken
            );

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }

        // =============================================
        // GET: api/v1/san-pham/{slug}
        // CHI TIET SAN PHAM
        // =============================================

        [HttpGet("{slug}")]
        public async Task<IActionResult> LayChiTiet(
            string slug,
            CancellationToken cancellationToken)
        {
            var ketQua = await _service.LayChiTietCongKhaiAsync(
                slug,
                cancellationToken
            );

            if (ketQua == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy sản phẩm."
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
