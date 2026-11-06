
namespace FashionStore.API.DTOs.Orders
{
    public class DonHangResponseDto
    {
        public Guid Id { get; set; }

        public string MaDonHang { get; set; } = string.Empty;

        public string TrangThai { get; set; } = string.Empty;

        public string TrangThaiThanhToan { get; set; } = string.Empty;

        public string PhuongThucThanhToan { get; set; } = string.Empty;

        public decimal TongTienHang { get; set; }

        public decimal TienGiamGia { get; set; }

        public decimal PhiVanChuyen { get; set; }

        public decimal TongThanhToan { get; set; }

        public string TienTe { get; set; } = "VND";

        public string TenNguoiNhan { get; set; } = string.Empty;

        public string SoDienThoaiNhan { get; set; } = string.Empty;

        public string TinhThanhNhan { get; set; } = string.Empty;

        public string? QuanHuyenNhan { get; set; }

        public string PhuongXaNhan { get; set; } = string.Empty;

        public string DiaChiChiTietNhan { get; set; } = string.Empty;

        public string? GhiChuKhachHang { get; set; }

        public string? TrangThaiGiaoDichThanhToan { get; set; }

        public decimal? SoTienThanhToan { get; set; }

        public string? TrangThaiVanChuyen { get; set; }

        public string? DonViVanChuyen { get; set; }

        public string? MaVanDon { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public List<DonHangChiTietResponseDto> ChiTietDonHangs { get; set; }
            = new List<DonHangChiTietResponseDto>();

        public List<LichSuDonHangResponseDto> LichSuTrangThai { get; set; }
            = new List<LichSuDonHangResponseDto>();
    }
}
