
using FashionStore.API.DTOs.Orders;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/don-hang")]
    [Authorize(Roles = "khach_hang")]
    public class DonHangController : ControllerBase
    {
        private readonly IDonHangService _donHangService;
        private readonly IHuyDonHangService _huyDonHangService;

        public DonHangController(IDonHangService donHangService, IHuyDonHangService huyDonHangService)
        {
            _donHangService = donHangService;
            _huyDonHangService = huyDonHangService;
        }


        // =====================================================
        // PUT: api/v1/don-hang/{donHangId}/huy
        // KHACH HANG HUY DON HANG
        // =====================================================

        [HttpPut("{donHangId:guid}/huy")]
        public async Task<IActionResult> KhachHangHuyDon(
            Guid donHangId,
            [FromBody] HuyDonHangRequestDto request,
            CancellationToken cancellationToken)
        {
            string? sub = User.FindFirst("sub")?.Value;

            if (!Guid.TryParse(sub, out Guid nguoiDungId))
            {
                return Unauthorized();
            }

            try
            {
                var ketQua = await _huyDonHangService.KhachHangHuyAsync(
                    nguoiDungId,
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
        // POST: api/v1/don-hang/checkout
        // =====================================================

        [HttpPost("checkout")]
        public async Task<IActionResult> TaoDonHang(
            [FromBody] TaoDonHangRequestDto request,
            CancellationToken cancellationToken)
        {
            string? sub = User.FindFirst("sub")?.Value;

            if (!Guid.TryParse(sub, out Guid nguoiDungId))
            {
                return Unauthorized();
            }

            try
            {
                var ketQua = await _donHangService.TaoDonHangAsync(
                    nguoiDungId,
                    request,
                    cancellationToken
                );

                return StatusCode(
                    StatusCodes.Status201Created,
                    ketQua
                );
            }
            catch (DonHangServiceException ex)
            {
                return Problem(
                    statusCode: ex.StatusCode,
                    title: "Không thể tạo đơn hàng",
                    detail: ex.Message
                );
            }
        }


        // =====================================================
        // GET: api/v1/don-hang
        // LAY DANH SACH DON HANG CUA TOI
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> LayDanhSachDonHang(
            [FromQuery] int trang = 1,
            [FromQuery] int kichThuocTrang = 10,
            [FromQuery] string? trangThai = null,
            CancellationToken cancellationToken = default)
        {
            string? sub = User.FindFirst("sub")?.Value;

            if (!Guid.TryParse(sub, out Guid nguoiDungId))
            {
                return Unauthorized();
            }

            try
            {
                var ketQua = await _donHangService.LayDanhSachCuaToiAsync(
                    nguoiDungId,
                    trang,
                    kichThuocTrang,
                    trangThai,
                    cancellationToken
                );

                return Ok(ketQua);
            }
            catch (DonHangServiceException ex)
            {
                return Problem(
                    statusCode: ex.StatusCode,
                    title: "Không thể lấy danh sách đơn hàng",
                    detail: ex.Message
                );
            }
        }


        // =====================================================
        // GET: api/v1/don-hang/{donHangId}
        // LAY CHI TIET DON HANG
        // =====================================================

        [HttpGet("{donHangId:guid}")]
        public async Task<IActionResult> LayChiTietDonHang(
            Guid donHangId,
            CancellationToken cancellationToken)
        {
            string? sub = User.FindFirst("sub")?.Value;

            if (!Guid.TryParse(sub, out Guid nguoiDungId))
            {
                return Unauthorized();
            }

            var ketQua = await _donHangService.LayChiTietCuaToiAsync(
                nguoiDungId,
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
    }
}
