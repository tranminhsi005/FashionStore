
using FashionStore.API.DTOs.Inventory;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/admin/kho")]
    [Authorize(Roles = "quan_tri_vien")]
    public class AdminTonKhoController : ControllerBase
    {
        private readonly ITonKhoService _service;

        public AdminTonKhoController(ITonKhoService service)
        {
            _service = service;
        }

        // Lay ID nguoi dang dang nhap tu JWT
        private Guid? LayNguoiThucHienId()
        {
            string? id = User.FindFirst("sub")?.Value;

            if (Guid.TryParse(id, out Guid nguoiDungId))
            {
                return nguoiDungId;
            }

            return null;
        }

        // GET: api/v1/admin/kho
        [HttpGet]
        public async Task<IActionResult> LayDanhSach(
            [FromQuery] string? tuKhoa,
            [FromQuery] bool? conHang,
            [FromQuery] int trang = 1,
            [FromQuery] int kichThuocTrang = 20,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var result = await _service.LayDanhSachAsync(
                    tuKhoa,
                    conHang,
                    trang,
                    kichThuocTrang,
                    cancellationToken
                );

                return Ok(result);
            }
            catch (TonKhoServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // GET: api/v1/admin/kho/bien-the/{bienTheId}
        [HttpGet("bien-the/{bienTheId:guid}")]
        public async Task<IActionResult> LayChiTiet(
            Guid bienTheId,
            CancellationToken cancellationToken)
        {
            var result = await _service.LayChiTietAsync(
                bienTheId,
                cancellationToken
            );

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy biến thể sản phẩm."
                });
            }

            return Ok(result);
        }

        // GET: api/v1/admin/kho/bien-the/{bienTheId}/lich-su
        [HttpGet("bien-the/{bienTheId:guid}/lich-su")]
        public async Task<IActionResult> LayLichSu(
            Guid bienTheId,
            [FromQuery] int trang = 1,
            [FromQuery] int kichThuocTrang = 20,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var result = await _service.LayLichSuAsync(
                    bienTheId,
                    trang,
                    kichThuocTrang,
                    cancellationToken
                );

                return Ok(result);
            }
            catch (TonKhoServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // POST: api/v1/admin/kho/bien-the/{bienTheId}/nhap
        [HttpPost("bien-the/{bienTheId:guid}/nhap")]
        public async Task<IActionResult> NhapKho(
            Guid bienTheId,
            [FromBody] TaoGiaoDichKhoRequestDto request,
            CancellationToken cancellationToken)
        {
            Guid? nguoiThucHienId = LayNguoiThucHienId();

            if (!nguoiThucHienId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Không xác định được người thực hiện."
                });
            }

            try
            {
                var result = await _service.NhapKhoAsync(
                    bienTheId,
                    request,
                    nguoiThucHienId.Value,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Nhập kho thành công.",
                    data = result
                });
            }
            catch (TonKhoServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // POST: api/v1/admin/kho/bien-the/{bienTheId}/xuat
        [HttpPost("bien-the/{bienTheId:guid}/xuat")]
        public async Task<IActionResult> XuatKho(
            Guid bienTheId,
            [FromBody] TaoGiaoDichKhoRequestDto request,
            CancellationToken cancellationToken)
        {
            Guid? nguoiThucHienId = LayNguoiThucHienId();

            if (!nguoiThucHienId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Không xác định được người thực hiện."
                });
            }

            try
            {
                var result = await _service.XuatKhoAsync(
                    bienTheId,
                    request,
                    nguoiThucHienId.Value,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Xuất kho thành công.",
                    data = result
                });
            }
            catch (TonKhoServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }

        // PUT: api/v1/admin/kho/bien-the/{bienTheId}/dieu-chinh
        [HttpPut("bien-the/{bienTheId:guid}/dieu-chinh")]
        public async Task<IActionResult> DieuChinh(
            Guid bienTheId,
            [FromBody] DieuChinhTonKhoRequestDto request,
            CancellationToken cancellationToken)
        {
            Guid? nguoiThucHienId = LayNguoiThucHienId();

            if (!nguoiThucHienId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "Không xác định được người thực hiện."
                });
            }

            try
            {
                var result = await _service.DieuChinhAsync(
                    bienTheId,
                    request,
                    nguoiThucHienId.Value,
                    cancellationToken
                );

                return Ok(new
                {
                    message = "Điều chỉnh tồn kho thành công.",
                    data = result
                });
            }
            catch (TonKhoServiceException ex)
            {
                return StatusCode(
                    ex.StatusCode,
                    new { message = ex.Message }
                );
            }
        }
    }
}
