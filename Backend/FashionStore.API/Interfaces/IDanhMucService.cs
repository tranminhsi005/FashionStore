
using FashionStore.API.DTOs.Categories;

namespace FashionStore.API.Interfaces
{
    public interface IDanhMucService
    {
        Task<List<DanhMucResponseDto>> LayDanhSachAsync(
            bool baoGomNgungHoatDong,
            CancellationToken cancellationToken
        );

        Task<DanhMucChiTietResponseDto?> LayTheoSlugAsync(
            string slug,
            CancellationToken cancellationToken
        );

        Task<DanhMucResponseDto> TaoAsync(
            DanhMucRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<DanhMucResponseDto?> CapNhatAsync(
            Guid id,
            DanhMucRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<bool> NgungHoatDongAsync(
            Guid id,
            CancellationToken cancellationToken
        );
    }
}
