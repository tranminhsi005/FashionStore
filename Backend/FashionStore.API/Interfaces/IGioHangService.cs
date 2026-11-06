using FashionStore.API.DTOs.Cart;

namespace FashionStore.API.Interfaces
{
    public interface IGioHangService
    {
        Task<GioHangResponseDto> LayGioHangAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken
        );

        Task<GioHangResponseDto> ThemVaoGioHangAsync(
            Guid nguoiDungId,
            ThemVaoGioHangRequestDto request,
            CancellationToken cancellationToken
        );

        Task<GioHangResponseDto> CapNhatSoLuongAsync(
            Guid nguoiDungId,
            Guid chiTietId,
            CapNhatGioHangRequestDto request,
            CancellationToken cancellationToken
        );

        Task<GioHangResponseDto> XoaSanPhamAsync(
            Guid nguoiDungId,
            Guid chiTietId,
            CancellationToken cancellationToken
        );

        Task<GioHangResponseDto> XoaTatCaAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken
        );
    }
}