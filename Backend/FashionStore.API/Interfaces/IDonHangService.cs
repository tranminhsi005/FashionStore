
using FashionStore.API.DTOs.Common;
using FashionStore.API.DTOs.Orders;

namespace FashionStore.API.Interfaces
{
    public interface IDonHangService
    {
        Task<DonHangResponseDto> TaoDonHangAsync(
            Guid nguoiDungId,
            TaoDonHangRequestDto request,
            CancellationToken cancellationToken
        );

        Task<PhanTrangResponseDto<DonHangDanhSachResponseDto>>
            LayDanhSachCuaToiAsync(
                Guid nguoiDungId,
                int trang,
                int kichThuocTrang,
                string? trangThai,
                CancellationToken cancellationToken
            );

        Task<DonHangResponseDto?> LayChiTietCuaToiAsync(
            Guid nguoiDungId,
            Guid donHangId,
            CancellationToken cancellationToken
        );
    }
}
