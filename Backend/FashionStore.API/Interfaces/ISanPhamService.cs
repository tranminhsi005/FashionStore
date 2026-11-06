
using FashionStore.API.DTOs.Common;
using FashionStore.API.DTOs.Products;

namespace FashionStore.API.Interfaces
{
    public interface ISanPhamService
    {
        Task<List<SanPhamAdminResponseDto>> LayDanhSachAdminAsync(
            string? tuKhoa,
            CancellationToken cancellationToken
        );

        Task<SanPhamAdminChiTietResponseDto?> LayChiTietAdminAsync(
            Guid id,
            CancellationToken cancellationToken
        );

        Task<SanPhamAdminChiTietResponseDto> TaoAsync(
            TaoSanPhamRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<SanPhamAdminChiTietResponseDto?> CapNhatAsync(
            Guid id,
            CapNhatSanPhamRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<SanPhamAdminChiTietResponseDto?> CapNhatTrangThaiAsync(
            Guid id,
            CapNhatTrangThaiSanPhamRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<BienTheSanPhamResponseDto> ThemBienTheAsync(
            Guid sanPhamId,
            TaoBienTheSanPhamRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<BienTheSanPhamResponseDto?> CapNhatBienTheAsync(
            Guid id,
            CapNhatBienTheRequestDto dto,
            CancellationToken cancellationToken
        );

        Task<bool> NgungBienTheAsync(
            Guid id,
            CancellationToken cancellationToken
        );


        // =============================================
        // API SAN PHAM CONG KHAI
        // =============================================

        Task<PhanTrangResponseDto<SanPhamCongKhaiResponseDto>>
            LayDanhSachCongKhaiAsync(
                SanPhamQueryDto query,
                CancellationToken cancellationToken
            );

        Task<SanPhamChiTietCongKhaiResponseDto?>
            LayChiTietCongKhaiAsync(
                string slug,
                CancellationToken cancellationToken
            );

        Task<List<SanPhamCongKhaiResponseDto>>
            LaySanPhamNoiBatAsync(
                int soLuong,
                CancellationToken cancellationToken
            );

        Task<List<SanPhamCongKhaiResponseDto>>
            LaySanPhamMoiNhatAsync(
                int soLuong,
                CancellationToken cancellationToken
            );
    }
}
