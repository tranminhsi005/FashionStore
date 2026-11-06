using FashionStore.API.DTOs.Common;
using FashionStore.API.DTOs.Inventory;

namespace FashionStore.API.Interfaces
{
    public interface ITonKhoService
    {
        Task<PhanTrangResponseDto<TonKhoAdminResponseDto>>
            LayDanhSachAsync(
                string? tuKhoa,
                bool? conHang,
                int trang,
                int kichThuocTrang,
                CancellationToken cancellationToken
            );

        Task<TonKhoAdminResponseDto?> LayChiTietAsync(
            Guid bienTheId,
            CancellationToken cancellationToken
        );

        Task<PhanTrangResponseDto<LichSuTonKhoAdminResponseDto>>
            LayLichSuAsync(
                Guid bienTheId,
                int trang,
                int kichThuocTrang,
                CancellationToken cancellationToken
            );

        Task<GiaoDichTonKhoResponseDto> NhapKhoAsync(
            Guid bienTheId,
            TaoGiaoDichKhoRequestDto request,
            Guid nguoiThucHienId,
            CancellationToken cancellationToken
        );

        Task<GiaoDichTonKhoResponseDto> XuatKhoAsync(
            Guid bienTheId,
            TaoGiaoDichKhoRequestDto request,
            Guid nguoiThucHienId,
            CancellationToken cancellationToken
        );

        Task<GiaoDichTonKhoResponseDto> DieuChinhAsync(
            Guid bienTheId,
            DieuChinhTonKhoRequestDto request,
            Guid nguoiThucHienId,
            CancellationToken cancellationToken
        );
    }
}