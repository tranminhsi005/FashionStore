
using FashionStore.API.DTOs.Common;
using FashionStore.API.DTOs.Orders;

namespace FashionStore.API.Interfaces
{
    public interface IQuanTriDonHangService
    {
        Task<PhanTrangResponseDto<DonHangAdminDanhSachResponseDto>>
            LayDanhSachAsync(
                int trang,
                int kichThuocTrang,
                string? trangThai,
                string? tuKhoa,
                CancellationToken cancellationToken
            );

        Task<DonHangAdminChiTietResponseDto?> LayChiTietAsync(
            Guid donHangId,
            CancellationToken cancellationToken
        );

        Task<DonHangAdminChiTietResponseDto> CapNhatTrangThaiAsync(
            Guid adminId,
            Guid donHangId,
            CapNhatTrangThaiDonHangAdminRequestDto request,
            CancellationToken cancellationToken
        );

        Task<DonHangAdminChiTietResponseDto> CapNhatVanChuyenAsync(
            Guid adminId,
            Guid donHangId,
            CapNhatVanChuyenAdminRequestDto request,
            CancellationToken cancellationToken
        );
    }
}
