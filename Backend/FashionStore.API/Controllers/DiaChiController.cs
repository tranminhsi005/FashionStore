
using FashionStore.API.DTOs.Addresses;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/dia-chi")]
    [Authorize(Roles = "khach_hang")]
    public class DiaChiController : ControllerBase
    {
        private readonly IDiaChiService _service;

        public DiaChiController(IDiaChiService service)
        {
            _service = service;
        }

        private Guid? LayNguoiDungId()
        {
            string? id = User.FindFirst("sub")?.Value;

            if (Guid.TryParse(id, out Guid nguoiDungId))
            {
                return nguoiDungId;
            }

            return null;
        }

        // GET: api/v1/dia-chi
        [HttpGet]
        public async Task<IActionResult> LayDanhSach(
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
                return Unauthorized();

            try
            {
                var result = await _service.LayDanhSachAsync(
                    nguoiDungId.Value,
                    cancellationToken
                );

                return Ok(result);
            }
            catch (DiaChiServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // POST: api/v1/dia-chi
        [HttpPost]
        public async Task<IActionResult> Tao(
            [FromBody] DiaChiGiaoHangRequestDto request,
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
                return Unauthorized();

            try
            {
                var result = await _service.TaoAsync(
                    nguoiDungId.Value,
                    request,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Thêm địa chỉ giao hàng thành công.",
                    data = result
                });
            }
            catch (DiaChiServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // PUT: api/v1/dia-chi/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> CapNhat(
            Guid id,
            [FromBody] DiaChiGiaoHangRequestDto request,
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
                return Unauthorized();

            try
            {
                var result = await _service.CapNhatAsync(
                    nguoiDungId.Value,
                    id,
                    request,
                    cancellationToken
                );

                if (result == null)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy địa chỉ."
                    });
                }

                return Ok(new
                {
                    message = "Cập nhật địa chỉ thành công.",
                    data = result
                });
            }
            catch (DiaChiServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // PUT: api/v1/dia-chi/{id}/mac-dinh
        [HttpPut("{id:guid}/mac-dinh")]
        public async Task<IActionResult> DatMacDinh(
            Guid id,
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
                return Unauthorized();

            try
            {
                bool thanhCong = await _service.DatMacDinhAsync(
                    nguoiDungId.Value,
                    id,
                    cancellationToken
                );

                if (!thanhCong)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy địa chỉ."
                    });
                }

                return Ok(new
                {
                    message = "Đã đặt địa chỉ mặc định."
                });
            }
            catch (DiaChiServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // DELETE: api/v1/dia-chi/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Xoa(
            Guid id,
            CancellationToken cancellationToken)
        {
            Guid? nguoiDungId = LayNguoiDungId();

            if (!nguoiDungId.HasValue)
                return Unauthorized();

            try
            {
                bool thanhCong = await _service.XoaAsync(
                    nguoiDungId.Value,
                    id,
                    cancellationToken
                );

                if (!thanhCong)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy địa chỉ."
                    });
                }

                return Ok(new
                {
                    message = "Đã xóa địa chỉ giao hàng."
                });
            }
            catch (DiaChiServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }
    }
}
