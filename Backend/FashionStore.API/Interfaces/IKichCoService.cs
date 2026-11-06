
using FashionStore.API.DTOs.Catalog;

namespace FashionStore.API.Interfaces
{
    public interface IKichCoService
    {
        Task<List<KichCoResponseDto>> LayDanhSachAsync(
            bool baoGomNgungHoatDong,
            CancellationToken cancellationToken
        );

        Task<KichCoResponseDto> TaoAsync(
            KichCoRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<KichCoResponseDto?> CapNhatAsync(
            Guid id,
            KichCoRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<bool> NgungHoatDongAsync(
            Guid id,
            CancellationToken cancellationToken
        );
    }
}
