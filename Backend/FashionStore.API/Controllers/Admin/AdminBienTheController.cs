
using FashionStore.API.DTOs.Products;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/bien-the")]
    [Authorize(Roles = "quan_tri_vien")]
    public class AdminBienTheController : ControllerBase
    {
        private readonly ISanPhamService _service;

        public AdminBienTheController(ISanPhamService service)
        {
            _service = service;
        }

        // =============================================
        // PUT: api/v1/admin/bien-the/{id}
        // CAP NHAT BIEN THE
        // =============================================

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> CapNhat(
            Guid id,
            [FromBody] CapNhatBienTheRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _service.CapNhatBienTheAsync(
                    id,
                    dto,
                    cancellationToken
                );

                if (ketQua == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy biến thể."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật biến thể thành công.",
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
        // DELETE: api/v1/admin/bien-the/{id}
        // NGUNG BAN BIEN THE
        // =============================================

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> NgungBan(
            Guid id,
            CancellationToken cancellationToken)
        {
            try
            {
                bool ketQua = await _service.NgungBienTheAsync(
                    id,
                    cancellationToken
                );

                if (!ketQua)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy biến thể."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Đã ngừng kinh doanh biến thể."
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
    }
}
