
using System.IdentityModel.Tokens.Jwt;

using FashionStore.API.DTOs.Auth;
using FashionStore.API.Interfaces;
using FashionStore.API.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        private readonly IConfiguration _configuration;

        private const string TenCookieRefresh = "refresh_token";

        private const string DuongDanCookie = "/api/v1/auth";

        public AuthController(
            IAuthService authService,
            IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }


        // =====================================================
        // 1. DANG KY
        // POST: api/v1/auth/dang-ky
        // =====================================================

        [AllowAnonymous]
        [HttpPost("dang-ky")]
        public async Task<IActionResult> DangKy(
            [FromBody] DangKyRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                var ketQua = await _authService.DangKyAsync(
                    dto,
                    cancellationToken
                );

                return StatusCode(
                    StatusCodes.Status201Created,
                    new
                    {
                        success = true,
                        message = "Đăng ký tài khoản thành công.",
                        data = ketQua
                    }
                );
            }
            catch (AuthServiceException ex)
            {
                return Loi(ex);
            }
        }


        // =====================================================
        // 2. DANG NHAP
        // POST: api/v1/auth/dang-nhap
        // =====================================================

        [AllowAnonymous]
        [HttpPost("dang-nhap")]
        public async Task<IActionResult> DangNhap(
            [FromBody] DangNhapRequestDto dto,
            CancellationToken cancellationToken)
        {
            try
            {
                string? thietBi = Request.Headers["User-Agent"].ToString();

                var diaChiIp = HttpContext.Connection.RemoteIpAddress;

                var ketQua = await _authService.DangNhapAsync(
                    dto,
                    thietBi,
                    diaChiIp,
                    cancellationToken
                );

                // Luu refresh token trong cookie HttpOnly
                DatRefreshCookie(
                    ketQua.RefreshToken,
                    ketQua.RefreshTokenHetHanLuc
                );

                // Chi tra access token trong JSON
                return Ok(new
                {
                    success = true,
                    message = "Đăng nhập thành công.",
                    data = ketQua.Response
                });
            }
            catch (AuthServiceException ex)
            {
                return Loi(ex);
            }
        }


        // =====================================================
        // 3. LAM MOI ACCESS TOKEN
        // POST: api/v1/auth/lam-moi-token
        // =====================================================

        [AllowAnonymous]
        [HttpPost("lam-moi-token")]
        public async Task<IActionResult> LamMoiToken(
            CancellationToken cancellationToken)
        {
            if (!NguonCookieDuocPhep())
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        success = false,
                        message = "Nguồn yêu cầu không được phép."
                    }
                );
            }

            if (!Request.Cookies.TryGetValue(
                TenCookieRefresh,
                out string? refreshToken))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Không tìm thấy refresh token."
                });
            }

            try
            {
                string? thietBi = Request.Headers["User-Agent"].ToString();

                var diaChiIp = HttpContext.Connection.RemoteIpAddress;

                var ketQua = await _authService.LamMoiTokenAsync(
                    refreshToken,
                    thietBi,
                    diaChiIp,
                    cancellationToken
                );

                // Thay cookie cu bang cookie moi
                DatRefreshCookie(
                    ketQua.RefreshToken,
                    ketQua.RefreshTokenHetHanLuc
                );

                return Ok(new
                {
                    success = true,
                    message = "Làm mới token thành công.",
                    data = ketQua.Response
                });
            }
            catch (AuthServiceException ex)
            {
                XoaRefreshCookie();

                return Loi(ex);
            }
        }


        // =====================================================
        // 4. DANG XUAT
        // POST: api/v1/auth/dang-xuat
        // =====================================================

        [AllowAnonymous]
        [HttpPost("dang-xuat")]
        public async Task<IActionResult> DangXuat(
            CancellationToken cancellationToken)
        {
            if (!NguonCookieDuocPhep())
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        success = false,
                        message = "Nguồn yêu cầu không được phép."
                    }
                );
            }

            Request.Cookies.TryGetValue(
                TenCookieRefresh,
                out string? refreshToken
            );

            await _authService.DangXuatAsync(
                refreshToken,
                cancellationToken
            );

            XoaRefreshCookie();

            return NoContent();
        }


        // =====================================================
        // 5. LAY THONG TIN NGUOI DUNG HIEN TAI
        // GET: api/v1/auth/toi
        // =====================================================

        [Authorize]
        [HttpGet("toi")]
        public async Task<IActionResult> Toi(
            CancellationToken cancellationToken)
        {
            string? id = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (!Guid.TryParse(id, out Guid nguoiDungId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Access token không hợp lệ."
                });
            }

            try
            {
                var ketQua = await _authService.LayThongTinHienTaiAsync(
                    nguoiDungId,
                    cancellationToken
                );

                return Ok(new
                {
                    success = true,
                    data = ketQua
                });
            }
            catch (AuthServiceException ex)
            {
                return Loi(ex);
            }
        }


        // =====================================================
        // CAC HAM HO TRO COOKIE
        // =====================================================

        private void DatRefreshCookie(
            string refreshToken,
            DateTimeOffset hetHan)
        {
            Response.Cookies.Append(
                TenCookieRefresh,
                refreshToken,
                new CookieOptions
                {
                    HttpOnly = true,

                    Secure = true,

                    SameSite = SameSiteMode.None,

                    Expires = hetHan,

                    Path = DuongDanCookie,

                    IsEssential = true
                }
            );
        }

        private void XoaRefreshCookie()
        {
            Response.Cookies.Delete(
                TenCookieRefresh,
                new CookieOptions
                {
                    HttpOnly = true,

                    Secure = true,

                    SameSite = SameSiteMode.None,

                    Path = DuongDanCookie
                }
            );
        }


        // =====================================================
        // KIEM TRA NGUON REQUEST VA CHONG CSRF
        // =====================================================

        private bool NguonCookieDuocPhep()
        {
            // Custom header giup yeu cau cookie endpoint phai qua preflight.
            string header = Request.Headers["X-Auth-Action"].ToString();

            if (header != "1")
            {
                return false;
            }

            string origin = Request.Headers["Origin"].ToString();

            if (string.IsNullOrWhiteSpace(origin))
            {
                return false;
            }

            string originHienTai = $"{Request.Scheme}://{Request.Host}";

            // Cho phep Swagger cung origin voi API
            if (string.Equals(
                origin,
                originHienTai,
                StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            var danhSachNguon = _configuration
                .GetSection("Cors:AllowedOrigins")
                .Get<string[]>() ?? Array.Empty<string>();

            return danhSachNguon.Any(x =>
                string.Equals(
                    x.TrimEnd('/'),
                    origin.TrimEnd('/'),
                    StringComparison.OrdinalIgnoreCase
                )
            );
        }


        private IActionResult Loi(AuthServiceException ex)
        {
            return StatusCode(
                ex.StatusCode,
                new
                {
                    success = false,
                    message = ex.Message
                }
            );
        }
    }
}
