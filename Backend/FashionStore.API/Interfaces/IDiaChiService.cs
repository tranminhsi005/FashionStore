using FashionStore.API.DTOs.Addresses;

namespace FashionStore.API.Interfaces
{
    public interface IDiaChiService
    {
        Task<List<DiaChiGiaoHangResponseDto>> LayDanhSachAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken
        );

        Task<DiaChiGiaoHangResponseDto> TaoAsync(
            Guid nguoiDungId,
            DiaChiGiaoHangRequestDto request,
            CancellationToken cancellationToken
        );

        Task<DiaChiGiaoHangResponseDto?> CapNhatAsync(
            Guid nguoiDungId,
            Guid diaChiId,
            DiaChiGiaoHangRequestDto request,
            CancellationToken cancellationToken
        );

        Task<bool> DatMacDinhAsync(
            Guid nguoiDungId,
            Guid diaChiId,
            CancellationToken cancellationToken
        );

        Task<bool> XoaAsync(
            Guid nguoiDungId,
            Guid diaChiId,
            CancellationToken cancellationToken
        );
    }
}