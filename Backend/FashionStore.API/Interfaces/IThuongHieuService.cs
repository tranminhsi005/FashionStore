
using FashionStore.API.DTOs.Catalog;

namespace FashionStore.API.Interfaces
{
    public interface IThuongHieuService
    {
        Task<List<ThuongHieuResponseDto>> LayDanhSachAsync(
            bool baoGomNgungHoatDong,
            CancellationToken cancellationToken
        );

        Task<ThuongHieuResponseDto?> LayTheoSlugAsync(
            string slug,
            CancellationToken cancellationToken
        );

        Task<ThuongHieuResponseDto> TaoAsync(
            ThuongHieuRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<ThuongHieuResponseDto?> CapNhatAsync(
            Guid id,
            ThuongHieuRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<bool> NgungHoatDongAsync(
            Guid id,
            CancellationToken cancellationToken
        );
    }
}
