using FashionStore.API.DTOs.Images;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/admin")]
    [Authorize(Roles = "quan_tri_vien")]
    public class AdminAnhSanPhamController : ControllerBase
    {
        private readonly IAnhSanPhamService _service;

        public AdminAnhSanPhamController(
            IAnhSanPhamService service)
        {
            _service = service;
        }

        // GET: api/v1/admin/san-pham/{sanPhamId}/anh
        [HttpGet("san-pham/{sanPhamId:guid}/anh")]
        public async Task<IActionResult> LayDanhSach(
            Guid sanPhamId,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _service.LayDanhSachAsync(
                    sanPhamId,
                    cancellationToken
                );

                return Ok(result);
            }
            catch (AnhSanPhamServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // POST: api/v1/admin/san-pham/{sanPhamId}/anh
        [HttpPost("san-pham/{sanPhamId:guid}/anh")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(6 * 1024 * 1024)]
        public async Task<IActionResult> Upload(
            Guid sanPhamId,
            [FromForm] TaoAnhSanPhamRequestDto request,
            CancellationToken cancellationToken)
        {
            try
            {
                var result = await _service.UploadAsync(
                    sanPhamId,
                    request,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Upload ảnh thành công.",
                    data = result
                });
            }
            catch (AnhSanPhamServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new
                {
                    message = "Không thể upload ảnh lên Supabase Storage.",
                    detail = ex.Message
                });
            }
        }

        // DELETE: api/v1/admin/anh-san-pham/{anhId}
        [HttpDelete("anh-san-pham/{anhId:guid}")]
        public async Task<IActionResult> Xoa(
            Guid anhId,
            CancellationToken cancellationToken)
        {
            try
            {
                await _service.XoaAsync(
                    anhId,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Xóa ảnh thành công."
                });
            }
            catch (AnhSanPhamServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // PUT: api/v1/admin/anh-san-pham/{anhId}/anh-chinh
        [HttpPut("anh-san-pham/{anhId:guid}/anh-chinh")]
        public async Task<IActionResult> DatAnhChinh(
            Guid anhId,
            CancellationToken cancellationToken)
        {
            try
            {
                await _service.DatAnhChinhAsync(
                    anhId,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Đã cập nhật ảnh đại diện sản phẩm."
                });
            }
            catch (AnhSanPhamServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }
    }
}