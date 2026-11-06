
using FashionStore.API.DTOs.Categories;
using FashionStore.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/danh-muc")]
    public class CategoriesController : ControllerBase
    {
        private readonly IDanhMucService _danhMucService;

        public CategoriesController(IDanhMucService danhMucService)
        {
            _danhMucService = danhMucService;
        }

        // =========================================
        // GET: api/v1/danh-muc
        // Lay danh sach danh muc dang hoat dong
        // =========================================

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> LayDanhSach(
            [FromQuery] bool baoGomNgungHoatDong = false,
            CancellationToken cancellationToken = default)
        {
            if (baoGomNgungHoatDong &&
                !User.IsInRole("quan_tri_vien"))
            {
                return Forbid();
            }

            var ketQua = await _danhMucService.LayDanhSachAsync(
                baoGomNgungHoatDong,
                cancellationToken
            );

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }

        // =========================================
        // GET: api/v1/danh-muc/{slug}
        // =========================================

        [HttpGet("{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> LayTheoSlug(
            string slug,
            CancellationToken cancellationToken)
        {
            var ketQua = await _danhMucService.LayTheoSlugAsync(
                slug,
                cancellationToken
            );

            if (ketQua == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy danh mục."
                });
            }

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }

        // =========================================
        // POST: api/v1/danh-muc
        // Chi Admin
        // =========================================

        [HttpPost]
        [Authorize(Roles = "quan_tri_vien")]
        public async Task<IActionResult> Tao(
            [FromBody] DanhMucRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _danhMucService.TaoAsync(
                    dto,
                    cancellationToken
                );

                return StatusCode(201, new
                {
                    success = true,
                    message = "Tạo danh mục thành công.",
                    data = ketQua
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // =========================================
        // PUT: api/v1/danh-muc/{id}
        // Chi Admin
        // =========================================

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "quan_tri_vien")]
        public async Task<IActionResult> CapNhat(
            Guid id,
            [FromBody] DanhMucRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _danhMucService.CapNhatAsync(
                    id,
                    dto,
                    cancellationToken
                );

                if (ketQua == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy danh mục."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật danh mục thành công.",
                    data = ketQua
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // =========================================
        // DELETE: api/v1/danh-muc/{id}
        // Ngung hoat dong, khong xoa vat ly
        // =========================================

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "quan_tri_vien")]
        public async Task<IActionResult> NgungHoatDong(
            Guid id,
            CancellationToken cancellationToken)
        {
            try
            {
                bool ketQua = await _danhMucService.NgungHoatDongAsync(
                    id,
                    cancellationToken
                );

                if (!ketQua)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy danh mục."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Đã ngừng hoạt động danh mục."
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}
