
using FashionStore.API.DTOs.Orders;
using FashionStore.API.DTOs.Payments;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/admin/don-hang")]
    [Authorize(Roles = "quan_tri_vien")]
    public class QuanTriDonHangController : ControllerBase
    {
        private readonly IQuanTriDonHangService _service;
        private readonly IHuyDonHangService _huyDonHangService;
        private readonly IThanhToanService _thanhToanService;
        public QuanTriDonHangController(
    IQuanTriDonHangService service,
    IHuyDonHangService huyDonHangService,
    IThanhToanService thanhToanService)
        {
            _service = service;
            _huyDonHangService = huyDonHangService;
            _thanhToanService = thanhToanService;
        }


        // =====================================================
        // PUT: api/v1/admin/don-hang/{donHangId}/xac-nhan-da-giao
        // ADMIN XAC NHAN DA GIAO VA DA THU TIEN MAT
        // =====================================================

        [HttpPut("{donHangId:guid}/xac-nhan-da-giao")]
        public async Task<IActionResult> XacNhanDaGiaoCOD(
            Guid donHangId,
            [FromBody] XacNhanDaGiaoCODRequestDto request,
            CancellationToken cancellationToken)
        {
            string? sub = User.FindFirst("sub")?.Value;

            if (!Guid.TryParse(sub, out Guid adminId))
            {
                return Unauthorized();
            }

            try
            {
                var ketQua = await _thanhToanService.XacNhanDaGiaoCODAsync(
                    adminId,
                    donHangId,
                    request,
                    cancellationToken
                );

                return Ok(ketQua);
            }
            catch (ThanhToanServiceException ex)
            {
                return Problem(
                    statusCode: ex.StatusCode,
                    title: "Không thể xác nhận giao hàng và thanh toán",
                    detail: ex.Message
                );
            }
        }

        // =====================================================
        // PUT: api/v1/admin/don-hang/{donHangId}/huy
        // ADMIN HUY DON HANG
        // =====================================================

        [HttpPut("{donHangId:guid}/huy")]
        public async Task<IActionResult> AdminHuyDon(
            Guid donHangId,
            [FromBody] HuyDonHangRequestDto request,
            CancellationToken cancellationToken)
        {
            string? sub = User.FindFirst("sub")?.Value;

            if (!Guid.TryParse(sub, out Guid adminId))
            {
                return Unauthorized();
            }

            try
            {
                var ketQua = await _huyDonHangService.AdminHuyAsync(
                    adminId,
                    donHangId,
                    request,
                    cancellationToken
                );

                return Ok(ketQua);
            }
            catch (HuyDonHangServiceException ex)
            {
                return Problem(
                    statusCode: ex.StatusCode,
                    title: "Không thể hủy đơn hàng",
                    detail: ex.Message
                );
            }
        }

        // =====================================================
        // GET: api/v1/admin/don-hang
        // LAY TAT CA DON HANG
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> LayDanhSach(
            [FromQuery] int trang = 1,
            [FromQuery] int kichThuocTrang = 10,
            [FromQuery] string? trangThai = null,
            [FromQuery] string? tuKhoa = null,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var ketQua = await _service.LayDanhSachAsync(
                    trang,
                    kichThuocTrang,
                    trangThai,
                    tuKhoa,
                    cancellationToken
                );

                return Ok(ketQua);
            }
            catch (QuanTriDonHangServiceException ex)
            {
                return Problem(
                    statusCode: ex.StatusCode,
                    title: "Không thể lấy danh sách đơn hàng",
                    detail: ex.Message
                );
            }
        }


        // =====================================================
        // GET: api/v1/admin/don-hang/{donHangId}
        // CHI TIET DON HANG
        // =====================================================

        [HttpGet("{donHangId:guid}")]
        public async Task<IActionResult> LayChiTiet(
            Guid donHangId,
            CancellationToken cancellationToken)
        {
            var ketQua = await _service.LayChiTietAsync(
                donHangId,
                cancellationToken
            );

            if (ketQua == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đơn hàng."
                });
            }

            return Ok(ketQua);
        }


        // =====================================================
        // PUT: api/v1/admin/don-hang/{donHangId}/trang-thai
        // CAP NHAT TRANG THAI DON HANG
        // =====================================================

        [HttpPut("{donHangId:guid}/trang-thai")]
        public async Task<IActionResult> CapNhatTrangThai(
            Guid donHangId,
            [FromBody] CapNhatTrangThaiDonHangAdminRequestDto request,
            CancellationToken cancellationToken)
        {
            string? sub = User.FindFirst("sub")?.Value;

            if (!Guid.TryParse(sub, out Guid adminId))
            {
                return Unauthorized();
            }

            try
            {
                var ketQua = await _service.CapNhatTrangThaiAsync(
                    adminId,
                    donHangId,
                    request,
                    cancellationToken
                );

                return Ok(ketQua);
            }
            catch (QuanTriDonHangServiceException ex)
            {
                return Problem(
                    statusCode: ex.StatusCode,
                    title: "Không thể cập nhật trạng thái đơn hàng",
                    detail: ex.Message
                );
            }
        }


        // =====================================================
        // PUT: api/v1/admin/don-hang/{donHangId}/van-chuyen
        // CAP NHAT TRANG THAI VAN CHUYEN
        // =====================================================

        [HttpPut("{donHangId:guid}/van-chuyen")]
        public async Task<IActionResult> CapNhatVanChuyen(
            Guid donHangId,
            [FromBody] CapNhatVanChuyenAdminRequestDto request,
            CancellationToken cancellationToken)
        {
            string? sub = User.FindFirst("sub")?.Value;

            if (!Guid.TryParse(sub, out Guid adminId))
            {
                return Unauthorized();
            }

            try
            {
                var ketQua = await _service.CapNhatVanChuyenAsync(
                    adminId,
                    donHangId,
                    request,
                    cancellationToken
                );

                return Ok(ketQua);
            }
            catch (QuanTriDonHangServiceException ex)
            {
                return Problem(
                    statusCode: ex.StatusCode,
                    detail: ex.Message
                );
            }
        }
    }
}
