
using FashionStore.API.DTOs.Catalog;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/kich-co")]
    [Authorize(Roles = "quan_tri_vien")]
    public class AdminKichCoController : ControllerBase
    {
        private readonly IKichCoService _service;

        public AdminKichCoController(IKichCoService service)
        {
            _service = service;
        }

        // GET: api/v1/admin/kich-co

        [HttpGet]
        public async Task<IActionResult> LayDanhSach(
            CancellationToken cancellationToken)
        {
            var ketQua = await _service.LayDanhSachAsync(
                true,
                cancellationToken
            );

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }

        // POST: api/v1/admin/kich-co

        [HttpPost]
        public async Task<IActionResult> Tao(
            KichCoRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _service.TaoAsync(
                    dto,
                    cancellationToken
                );

                return StatusCode(201, new
                {
                    success = true,
                    message = "Tạo kích cỡ thành công.",
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

        // PUT: api/v1/admin/kich-co/{id}

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> CapNhat(
            Guid id,
            KichCoRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _service.CapNhatAsync(
                    id,
                    dto,
                    cancellationToken
                );

                if (ketQua == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy kích cỡ."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật kích cỡ thành công.",
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

        // DELETE: api/v1/admin/kich-co/{id}

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> NgungHoatDong(
            Guid id,
            CancellationToken cancellationToken)
        {
            bool ketQua = await _service.NgungHoatDongAsync(
                id,
                cancellationToken
            );

            if (!ketQua)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy kích cỡ."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Đã ngừng hoạt động kích cỡ."
            });
        }
    }
}
