
using FashionStore.API.DTOs.Catalog;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/thuong-hieu")]
    [Authorize(Roles = "quan_tri_vien")]
    public class AdminThuongHieuController : ControllerBase
    {
        private readonly IThuongHieuService _service;

        public AdminThuongHieuController(
            IThuongHieuService service)
        {
            _service = service;
        }

        // GET: api/v1/admin/thuong-hieu

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

        // POST: api/v1/admin/thuong-hieu

        [HttpPost]
        public async Task<IActionResult> Tao(
            ThuongHieuRequestDto dto,
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
                    message = "Tạo thương hiệu thành công.",
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

        // PUT: api/v1/admin/thuong-hieu/{id}

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> CapNhat(
            Guid id,
            ThuongHieuRequestDto dto,
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
                        message = "Không tìm thấy thương hiệu."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật thương hiệu thành công.",
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

        // DELETE: api/v1/admin/thuong-hieu/{id}

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
                    message = "Không tìm thấy thương hiệu."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Đã ngừng hoạt động thương hiệu."
            });
        }
    }
}
