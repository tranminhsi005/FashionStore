using FashionStore.API.DTOs.Images;

namespace FashionStore.API.Interfaces
{
    public interface IAnhSanPhamService
    {
        Task<List<AnhSanPhamAdminResponseDto>> LayDanhSachAsync(
            Guid sanPhamId,
            CancellationToken cancellationToken
        );

        Task<AnhSanPhamAdminResponseDto> UploadAsync(
            Guid sanPhamId,
            TaoAnhSanPhamRequestDto request,
            CancellationToken cancellationToken
        );

        Task XoaAsync(
            Guid anhId,
            CancellationToken cancellationToken
        );

        Task DatAnhChinhAsync(
            Guid anhId,
            CancellationToken cancellationToken
        );
    }
}