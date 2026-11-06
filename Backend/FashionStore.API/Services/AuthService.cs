
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;

using FashionStore.API.Configurations;
using FashionStore.API.Data;
using FashionStore.API.DTOs.Auth;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using Npgsql;

namespace FashionStore.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        private readonly IPasswordHasher<NguoiDung> _passwordHasher;

        private readonly JwtOptions _jwtOptions;

        private readonly byte[] _khoaKy;

        public AuthService(
            AppDbContext context,
            IPasswordHasher<NguoiDung> passwordHasher,
            IOptions<JwtOptions> jwtOptions)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _jwtOptions = jwtOptions.Value;

            _khoaKy = Convert.FromBase64String(_jwtOptions.Secret);
        }

        // =====================================================
        // 1. DANG KY
        // =====================================================

        public async Task<DangKyResponseDto> DangKyAsync(
            DangKyRequestDto dto,
            CancellationToken cancellationToken)
        {
            string email = dto.Email.Trim().ToLowerInvariant();

            string hoTen = dto.HoTen.Trim();

            if (string.IsNullOrWhiteSpace(hoTen))
            {
                throw new AuthServiceException(
                    400,
                    "Họ tên không được để trống."
                );
            }

            // Kiem tra chinh sach mat khau
            if (!KiemTraMatKhau(dto.MatKhau))
            {
                throw new AuthServiceException(
                    400,
                    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."
                );
            }

            // Kiem tra email da ton tai
            bool emailDaTonTai = await _context.NguoiDungs
                .AnyAsync(
                    x => x.Email.ToLower() == email,
                    cancellationToken
                );

            if (emailDaTonTai)
            {
                throw new AuthServiceException(
                    409,
                    "Email đã được sử dụng."
                );
            }

            // Tim vai tro khach hang
            var vaiTro = await _context.VaiTros
                .FirstOrDefaultAsync(
                    x => x.Ma == "khach_hang",
                    cancellationToken
                );

            if (vaiTro == null)
            {
                throw new InvalidOperationException(
                    "Không tìm thấy vai trò khach_hang trong database. Hãy kiểm tra dữ liệu khởi tạo."
                );
            }

            DateTimeOffset hienTai = DateTimeOffset.UtcNow;

            // Tao nguoi dung
            var nguoiDung = new NguoiDung
            {
                Id = Guid.NewGuid(),

                HoTen = hoTen,

                Email = email,

                SoDienThoai = string.IsNullOrWhiteSpace(dto.SoDienThoai)
                    ? null
                    : dto.SoDienThoai.Trim(),

                EmailDaXacMinh = false,

                DangHoatDong = true,

                NgayTao = hienTai,

                NgayCapNhat = hienTai
            };

            // Bam mat khau
            nguoiDung.MatKhauHash = _passwordHasher.HashPassword(
                nguoiDung,
                dto.MatKhau
            );

            // Tao giao dich database
            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                _context.NguoiDungs.Add(nguoiDung);

                // Gan vai tro khach hang
                var nguoiDungVaiTro = new NguoiDungVaiTro
                {
                    NguoiDungId = nguoiDung.Id,

                    VaiTroId = vaiTro.Id,

                    NgayGan = hienTai
                };

                _context.NguoiDungVaiTros.Add(nguoiDungVaiTro);

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
                when (ex.InnerException is PostgresException pg
                    && pg.SqlState == PostgresErrorCodes.UniqueViolation)
            {
                await transaction.RollbackAsync(cancellationToken);

                throw new AuthServiceException(
                    409,
                    "Email đã được sử dụng."
                );
            }

            return new DangKyResponseDto
            {
                Id = nguoiDung.Id,

                HoTen = nguoiDung.HoTen,

                Email = nguoiDung.Email,

                SoDienThoai = nguoiDung.SoDienThoai,

                NgayTao = nguoiDung.NgayTao
            };
        }


        // =====================================================
        // 2. DANG NHAP
        // =====================================================

        public async Task<AuthTokenResult> DangNhapAsync(
            DangNhapRequestDto dto,
            string? thietBi,
            IPAddress? diaChiIp,
            CancellationToken cancellationToken)
        {
            string email = dto.Email.Trim().ToLowerInvariant();

            // Tim nguoi dung kem vai tro
            var nguoiDung = await _context.NguoiDungs
                .Include(x => x.NguoiDungVaiTros)
                    .ThenInclude(x => x.VaiTro)
                .FirstOrDefaultAsync(
                    x => x.Email.ToLower() == email,
                    cancellationToken
                );

            if (nguoiDung == null)
            {
                throw new AuthServiceException(
                    401,
                    "Email hoặc mật khẩu không chính xác."
                );
            }

            if (!nguoiDung.DangHoatDong)
            {
                throw new AuthServiceException(
                    403,
                    "Tài khoản hiện đã bị khóa."
                );
            }

            // Kiem tra mat khau
            var ketQua = _passwordHasher.VerifyHashedPassword(
                nguoiDung,
                nguoiDung.MatKhauHash,
                dto.MatKhau
            );

            if (ketQua == PasswordVerificationResult.Failed)
            {
                throw new AuthServiceException(
                    401,
                    "Email hoặc mật khẩu không chính xác."
                );
            }

            // Neu hash cu can nang cap thi bam lai
            if (ketQua == PasswordVerificationResult.SuccessRehashNeeded)
            {
                nguoiDung.MatKhauHash = _passwordHasher.HashPassword(
                    nguoiDung,
                    dto.MatKhau
                );
            }

            var danhSachVaiTro = nguoiDung.NguoiDungVaiTros
                .Select(x => x.VaiTro.Ma)
                .Distinct()
                .ToList();

            if (danhSachVaiTro.Count == 0)
            {
                throw new AuthServiceException(
                    403,
                    "Tài khoản chưa được gán vai trò."
                );
            }

            // Tao refresh token
            string refreshToken = TaoRefreshToken();

            string refreshTokenHash = BamRefreshToken(refreshToken);

            DateTimeOffset hienTai = DateTimeOffset.UtcNow;

            DateTimeOffset refreshHetHan = hienTai.AddDays(
                _jwtOptions.RefreshTokenDays
            );

            // Luu phien dang nhap
            var phienDangNhap = new PhienDangNhap
            {
                Id = Guid.NewGuid(),

                NguoiDungId = nguoiDung.Id,

                RefreshTokenHash = refreshTokenHash,

                ThayTheBoiHash = null,

                ThietBi = GioiHanChuoi(thietBi, 250),

                DiaChiIp = diaChiIp,

                HetHanLuc = refreshHetHan,

                DaThuHoiLuc = null,

                NgayTao = hienTai
            };

            _context.PhienDangNhaps.Add(phienDangNhap);

            await _context.SaveChangesAsync(cancellationToken);

            // Tra bo token
            return TaoBoToken(
                nguoiDung,
                danhSachVaiTro,
                refreshToken,
                refreshHetHan
            );
        }


        // =====================================================
        // 3. LAM MOI TOKEN
        // REFRESH TOKEN ROTATION
        // =====================================================

        public async Task<AuthTokenResult> LamMoiTokenAsync(
            string refreshToken,
            string? thietBi,
            IPAddress? diaChiIp,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                throw new AuthServiceException(
                    401,
                    "Refresh token không hợp lệ."
                );
            }

            string tokenHash = BamRefreshToken(refreshToken);

            DateTimeOffset hienTai = DateTimeOffset.UtcNow;

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            // Tim phien dang nhap
            var phienCu = await _context.PhienDangNhaps
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    x => x.RefreshTokenHash == tokenHash,
                    cancellationToken
                );

            if (phienCu == null)
            {
                throw new AuthServiceException(
                    401,
                    "Refresh token không hợp lệ."
                );
            }

            // Kiem tra token da bi su dung lai hay chua
            if (phienCu.DaThuHoiLuc.HasValue)
            {
                // Token da duoc thay the nhung lai bi gui lai.
                // Thu hoi tat ca phien dang nhap con hoat dong.
                if (!string.IsNullOrEmpty(phienCu.ThayTheBoiHash))
                {
                    await _context.PhienDangNhaps
                        .Where(x =>
                            x.NguoiDungId == phienCu.NguoiDungId &&
                            x.DaThuHoiLuc == null)
                        .ExecuteUpdateAsync(
                            s => s.SetProperty(
                                x => x.DaThuHoiLuc,
                                hienTai
                            ),
                            cancellationToken
                        );

                    await transaction.CommitAsync(cancellationToken);

                    throw new AuthServiceException(
                        401,
                        "Phát hiện refresh token đã được sử dụng lại. Vui lòng đăng nhập lại."
                    );
                }

                throw new AuthServiceException(
                    401,
                    "Phiên đăng nhập đã bị thu hồi."
                );
            }

            // Kiem tra han su dung
            if (phienCu.HetHanLuc <= hienTai)
            {
                await _context.PhienDangNhaps
                    .Where(x =>
                        x.Id == phienCu.Id &&
                        x.DaThuHoiLuc == null)
                    .ExecuteUpdateAsync(
                        s => s.SetProperty(
                            x => x.DaThuHoiLuc,
                            hienTai
                        ),
                        cancellationToken
                    );

                await transaction.CommitAsync(cancellationToken);

                throw new AuthServiceException(
                    401,
                    "Refresh token đã hết hạn."
                );
            }

            // Lay thong tin nguoi dung
            var nguoiDung = await _context.NguoiDungs
                .Include(x => x.NguoiDungVaiTros)
                    .ThenInclude(x => x.VaiTro)
                .FirstOrDefaultAsync(
                    x => x.Id == phienCu.NguoiDungId,
                    cancellationToken
                );

            if (nguoiDung == null || !nguoiDung.DangHoatDong)
            {
                await _context.PhienDangNhaps
                    .Where(x =>
                        x.NguoiDungId == phienCu.NguoiDungId &&
                        x.DaThuHoiLuc == null)
                    .ExecuteUpdateAsync(
                        s => s.SetProperty(
                            x => x.DaThuHoiLuc,
                            hienTai
                        ),
                        cancellationToken
                    );

                await transaction.CommitAsync(cancellationToken);

                throw new AuthServiceException(
                    401,
                    "Tài khoản không còn hoạt động."
                );
            }

            var danhSachVaiTro = nguoiDung.NguoiDungVaiTros
                .Select(x => x.VaiTro.Ma)
                .Distinct()
                .ToList();

            // Tao refresh token moi
            string tokenMoi = TaoRefreshToken();

            string tokenMoiHash = BamRefreshToken(tokenMoi);

            DateTimeOffset tokenMoiHetHan = hienTai.AddDays(
                _jwtOptions.RefreshTokenDays
            );

            // Cap nhat phien cu theo dieu kien nguyen tu.
            // Chi mot request dong thoi moi co the xoay token thanh cong.
            int soDongCapNhat = await _context.PhienDangNhaps
                .Where(x =>
                    x.Id == phienCu.Id &&
                    x.DaThuHoiLuc == null &&
                    x.HetHanLuc > hienTai)
                .ExecuteUpdateAsync(
                    s => s
                        .SetProperty(
                            x => x.DaThuHoiLuc,
                            hienTai
                        )
                        .SetProperty(
                            x => x.ThayTheBoiHash,
                            tokenMoiHash
                        ),
                    cancellationToken
                );

            if (soDongCapNhat != 1)
            {
                await transaction.RollbackAsync(cancellationToken);

                throw new AuthServiceException(
                    401,
                    "Refresh token không còn hợp lệ. Hãy đăng nhập lại."
                );
            }

            // Tao phien moi
            var phienMoi = new PhienDangNhap
            {
                Id = Guid.NewGuid(),

                NguoiDungId = nguoiDung.Id,

                RefreshTokenHash = tokenMoiHash,

                ThayTheBoiHash = null,

                ThietBi = GioiHanChuoi(thietBi, 250),

                DiaChiIp = diaChiIp,

                HetHanLuc = tokenMoiHetHan,

                DaThuHoiLuc = null,

                NgayTao = hienTai
            };

            _context.PhienDangNhaps.Add(phienMoi);

            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            return TaoBoToken(
                nguoiDung,
                danhSachVaiTro,
                tokenMoi,
                tokenMoiHetHan
            );
        }


        // =====================================================
        // 4. DANG XUAT
        // =====================================================

        public async Task DangXuatAsync(
            string? refreshToken,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return;
            }

            string tokenHash = BamRefreshToken(refreshToken);

            var phien = await _context.PhienDangNhaps
                .FirstOrDefaultAsync(
                    x => x.RefreshTokenHash == tokenHash,
                    cancellationToken
                );

            if (phien == null || phien.DaThuHoiLuc.HasValue)
            {
                return;
            }

            phien.DaThuHoiLuc = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
        }


        // =====================================================
        // 5. LAY THONG TIN NGUOI DUNG HIEN TAI
        // =====================================================

        public async Task<NguoiDungResponseDto> LayThongTinHienTaiAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken)
        {
            var nguoiDung = await _context.NguoiDungs
                .Include(x => x.NguoiDungVaiTros)
                    .ThenInclude(x => x.VaiTro)
                .FirstOrDefaultAsync(
                    x => x.Id == nguoiDungId,
                    cancellationToken
                );

            if (nguoiDung == null)
            {
                throw new AuthServiceException(
                    404,
                    "Không tìm thấy người dùng."
                );
            }

            if (!nguoiDung.DangHoatDong)
            {
                throw new AuthServiceException(
                    403,
                    "Tài khoản đã bị khóa."
                );
            }

            return TaoNguoiDungResponse(nguoiDung);
        }


        // =====================================================
        // CAC HAM HO TRO
        // =====================================================

        private bool KiemTraMatKhau(string matKhau)
        {
            if (string.IsNullOrWhiteSpace(matKhau) || matKhau.Length < 8)
            {
                return false;
            }

            bool coChuHoa = matKhau.Any(char.IsUpper);

            bool coChuThuong = matKhau.Any(char.IsLower);

            bool coSo = matKhau.Any(char.IsDigit);

            return coChuHoa && coChuThuong && coSo;
        }

        private string TaoRefreshToken()
        {
            byte[] bytes = RandomNumberGenerator.GetBytes(64);

            return Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .TrimEnd('=');
        }

        private string BamRefreshToken(string refreshToken)
        {
            byte[] data = Encoding.UTF8.GetBytes(refreshToken);

            byte[] hash = SHA256.HashData(data);

            return Convert.ToHexString(hash);
        }

        private string? GioiHanChuoi(string? value, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            value = value.Trim();

            return value.Length > maxLength
                ? value.Substring(0, maxLength)
                : value;
        }

        private NguoiDungResponseDto TaoNguoiDungResponse(
            NguoiDung nguoiDung)
        {
            return new NguoiDungResponseDto
            {
                Id = nguoiDung.Id,

                HoTen = nguoiDung.HoTen,

                Email = nguoiDung.Email,

                SoDienThoai = nguoiDung.SoDienThoai,

                VaiTros = nguoiDung.NguoiDungVaiTros
                    .Select(x => x.VaiTro.Ma)
                    .Distinct()
                    .ToList(),

                NgayTao = nguoiDung.NgayTao
            };
        }

        private AuthTokenResult TaoBoToken(
            NguoiDung nguoiDung,
            List<string> danhSachVaiTro,
            string refreshToken,
            DateTimeOffset refreshHetHan)
        {
            DateTimeOffset hienTai = DateTimeOffset.UtcNow;

            DateTimeOffset accessHetHan = hienTai.AddMinutes(
                _jwtOptions.AccessTokenMinutes
            );

            var danhSachClaims = new List<Claim>
            {
                new Claim(
                    JwtRegisteredClaimNames.Sub,
                    nguoiDung.Id.ToString()
                ),

                new Claim(
                    JwtRegisteredClaimNames.Email,
                    nguoiDung.Email
                ),

                new Claim("name", nguoiDung.HoTen),

                new Claim(
                    JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString()
                )
            };

            foreach (var vaiTro in danhSachVaiTro)
            {
                danhSachClaims.Add(
                    new Claim("role", vaiTro)
                );
            }

            var securityKey = new SymmetricSecurityKey(_khoaKy);

            var credentials = new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256
            );

            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: danhSachClaims,
                notBefore: hienTai.UtcDateTime,
                expires: accessHetHan.UtcDateTime,
                signingCredentials: credentials
            );

            string accessToken = new JwtSecurityTokenHandler()
                .WriteToken(jwt);

            return new AuthTokenResult
            {
                Response = new DangNhapResponseDto
                {
                    AccessToken = accessToken,

                    TokenType = "Bearer",

                    ExpiresIn = _jwtOptions.AccessTokenMinutes * 60,

                    NguoiDung = TaoNguoiDungResponse(nguoiDung)
                },

                RefreshToken = refreshToken,

                RefreshTokenHetHanLuc = refreshHetHan
            };
        }
    }
}
