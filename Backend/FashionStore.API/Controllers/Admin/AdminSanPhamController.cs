
using FashionStore.API.DTOs.Products;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/san-pham")]
    [Authorize(Roles = "quan_tri_vien")]
    public class AdminSanPhamController : ControllerBase
    {
        private readonly ISanPhamService _service;

        public AdminSanPhamController(ISanPhamService service)
        {
            _service = service;
        }

        // =============================================
        // GET: api/v1/admin/san-pham
        // LAY DANH SACH SAN PHAM
        // =============================================

        [HttpGet]
        public async Task<IActionResult> LayDanhSach(
            [FromQuery] string? tuKhoa,
            CancellationToken cancellationToken)
        {
            var ketQua = await _service.LayDanhSachAdminAsync(
                tuKhoa,
                cancellationToken
            );

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }

        // =============================================
        // GET: api/v1/admin/san-pham/{id}
        // LAY CHI TIET
        // =============================================

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> LayChiTiet(
            Guid id,
            CancellationToken cancellationToken)
        {
            var ketQua = await _service.LayChiTietAdminAsync(
                id,
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

        // =============================================
        // POST: api/v1/admin/san-pham
        // TAO SAN PHAM VA NHIEU BIEN THE
        // =============================================

        [HttpPost]
        public async Task<IActionResult> Tao(
            [FromBody] TaoSanPhamRequestDto dto,
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
                    message = "Tạo sản phẩm và biến thể thành công.",
                    data = ketQua
                });
            }
            catch (CatalogServiceException ex)
            {
                return Loi(ex);
            }
        }

        // =============================================
        // PUT: api/v1/admin/san-pham/{id}
        // CAP NHAT THONG TIN SAN PHAM
        // =============================================

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> CapNhat(
            Guid id,
            [FromBody] CapNhatSanPhamRequestDto dto,
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
                        message = "Không tìm thấy sản phẩm."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật sản phẩm thành công.",
                    data = ketQua
                });
            }
            catch (CatalogServiceException ex)
            {
                return Loi(ex);
            }
        }

        // =============================================
        // PATCH: api/v1/admin/san-pham/{id}/trang-thai
        // CAP NHAT TRANG THAI
        // =============================================

        [HttpPatch("{id:guid}/trang-thai")]
        public async Task<IActionResult> CapNhatTrangThai(
            Guid id,
            [FromBody] CapNhatTrangThaiSanPhamRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _service.CapNhatTrangThaiAsync(
                    id,
                    dto,
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
                    message = "Cập nhật trạng thái sản phẩm thành công.",
                    data = ketQua
                });
            }
            catch (CatalogServiceException ex)
            {
                return Loi(ex);
            }
        }

        // =============================================
        // POST: api/v1/admin/san-pham/{id}/bien-the
        // THEM BIEN THE
        // =============================================

        [HttpPost("{id:guid}/bien-the")]
        public async Task<IActionResult> ThemBienThe(
            Guid id,
            [FromBody] TaoBienTheSanPhamRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _service.ThemBienTheAsync(
                    id,
                    dto,
                    cancellationToken
                );

                return StatusCode(201, new
                {
                    success = true,
                    message = "Thêm biến thể thành công.",
                    data = ketQua
                });
            }
            catch (CatalogServiceException ex)
            {
                return Loi(ex);
            }
        }

        // =============================================
        // HAM TRA VE LOI
        // =============================================

        private IActionResult Loi(CatalogServiceException ex)
        {
            return StatusCode(ex.StatusCode, new
            {
                success = false,
                message = ex.Message
            });
        }
    }
}
