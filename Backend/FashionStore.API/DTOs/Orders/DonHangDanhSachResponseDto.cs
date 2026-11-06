
namespace FashionStore.API.DTOs.Orders
{
    public class DonHangDanhSachResponseDto
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

        public string TenNguoiNhan { get; set; } = string.Empty;

        public int SoLoaiSanPham { get; set; }

        public int TongSoLuongSanPham { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}
