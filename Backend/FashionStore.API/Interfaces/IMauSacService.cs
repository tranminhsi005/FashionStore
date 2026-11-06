
using FashionStore.API.DTOs.Catalog;

namespace FashionStore.API.Interfaces
{
    public interface IMauSacService
    {
        Task<List<MauSacResponseDto>> LayDanhSachAsync(
            bool baoGomNgungHoatDong,
            CancellationToken cancellationToken
        );

        Task<MauSacResponseDto> TaoAsync(
            MauSacRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<MauSacResponseDto?> CapNhatAsync(
            Guid id,
            MauSacRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<bool> NgungHoatDongAsync(
            Guid id,
            CancellationToken cancellationToken
        );
    }
}
