
using FashionStore.API.DTOs.Cart;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/gio-hang")]
    [Authorize(Roles = "khach_hang")]
    public class GioHangController : ControllerBase
    {
        private readonly IGioHangService _service;

        public GioHangController(IGioHangService service)
        {
            _service = service;
        }

        // Lay ID nguoi dung tu JWT
        private Guid? LayNguoiDungId()
        {
            string? id = User.FindFirst("sub")?.Value;

            if (Guid.TryParse(id, out Guid nguoiDungId))
            {
                return nguoiDungId;
            }

            return null;
        }

        // =====================================================
        // 1. LAY GIO HANG
        // GET: api/v1/gio-hang
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> LayGioHang(
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Không xác định được người dùng."
                });
            }

            try
            {
                var result = await _service.LayGioHangAsync(
                    nguoiDungId.Value,
                    cancellationToken
                );

                return Ok(result);
            }
            catch (GioHangServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // =====================================================
        // 2. THEM VAO GIO HANG
        // POST: api/v1/gio-hang/items
        // =====================================================

        [HttpPost("items")]
        public async Task<IActionResult> ThemVaoGioHang(
            [FromBody] ThemVaoGioHangRequestDto request,
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Không xác định được người dùng."
                });
            }

            try
            {
                var result = await _service.ThemVaoGioHangAsync(
                    nguoiDungId.Value,
                    request,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Đã thêm sản phẩm vào giỏ hàng.",
                    data = result
                });
            }
            catch (GioHangServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // =====================================================
        // 3. CAP NHAT SO LUONG
        // PUT: api/v1/gio-hang/items/{id}
        // =====================================================

        [HttpPut("items/{id:guid}")]
        public async Task<IActionResult> CapNhatSoLuong(
            Guid id,
            [FromBody] CapNhatGioHangRequestDto request,
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Không xác định được người dùng."
                });
            }

            try
            {
                var result = await _service.CapNhatSoLuongAsync(
                    nguoiDungId.Value,
                    id,
                    request,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Cập nhật giỏ hàng thành công.",
                    data = result
                });
            }
            catch (GioHangServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // =====================================================
        // 4. XOA MOT SAN PHAM
        // DELETE: api/v1/gio-hang/items/{id}
        // =====================================================

        [HttpDelete("items/{id:guid}")]
        public async Task<IActionResult> XoaSanPham(
            Guid id,
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Không xác định được người dùng."
                });
            }

            try
            {
                var result = await _service.XoaSanPhamAsync(
                    nguoiDungId.Value,
                    id,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Đã xóa sản phẩm khỏi giỏ hàng.",
                    data = result
                });
            }
            catch (GioHangServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // =====================================================
        // 5. XOA TOAN BO GIO HANG
        // DELETE: api/v1/gio-hang
        // =====================================================

        [HttpDelete]
        public async Task<IActionResult> XoaTatCa(
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Không xác định được người dùng."
                });
            }

            try
            {
                var result = await _service.XoaTatCaAsync(
                    nguoiDungId.Value,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Đã xóa toàn bộ giỏ hàng.",
                    data = result
                });
            }
            catch (GioHangServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }
    }
}
