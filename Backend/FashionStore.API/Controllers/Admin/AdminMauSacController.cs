
using FashionStore.API.DTOs.Catalog;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/mau-sac")]
    [Authorize(Roles = "quan_tri_vien")]
    public class AdminMauSacController : ControllerBase
    {
        private readonly IMauSacService _service;

        public AdminMauSacController(IMauSacService service)
        {
            _service = service;
        }

        // GET: api/v1/admin/mau-sac

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

        // POST: api/v1/admin/mau-sac

        [HttpPost]
        public async Task<IActionResult> Tao(
            MauSacRequestDto dto,
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
                    message = "Tạo màu sắc thành công.",
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

        // PUT: api/v1/admin/mau-sac/{id}

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> CapNhat(
            Guid id,
            MauSacRequestDto dto,
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
                        message = "Không tìm thấy màu sắc."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật màu sắc thành công.",
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

        // DELETE: api/v1/admin/mau-sac/{id}

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
                    message = "Không tìm thấy màu sắc."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Đã ngừng hoạt động màu sắc."
            });
        }
    }
}
