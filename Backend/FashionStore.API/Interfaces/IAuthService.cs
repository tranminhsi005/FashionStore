
using System.Net;
using FashionStore.API.DTOs.Auth;
using FashionStore.API.Services;

namespace FashionStore.API.Interfaces
{
    public interface IAuthService
    {
        Task<DangKyResponseDto> DangKyAsync(
            DangKyRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<AuthTokenResult> DangNhapAsync(
            DangNhapRequestDto dto,
            string? thietBi,
            IPAddress? diaChiIp,
            CancellationToken cancellationToken
        );

        Task<AuthTokenResult> LamMoiTokenAsync(
            string refreshToken,
            string? thietBi,
            IPAddress? diaChiIp,
            CancellationToken cancellationToken
        );

        Task DangXuatAsync(
            string? refreshToken,
            CancellationToken cancellationToken
        );

        Task<NguoiDungResponseDto> LayThongTinHienTaiAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken
        );
    }
}
