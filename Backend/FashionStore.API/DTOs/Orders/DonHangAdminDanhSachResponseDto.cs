
namespace FashionStore.API.DTOs.Orders
{
    public class DonHangAdminDanhSachResponseDto
    {
        public Guid Id { get; set; }

        public string MaDonHang { get; set; } = string.Empty;

        public Guid NguoiDungId { get; set; }

        public string TenKhachHang { get; set; } = string.Empty;

        public string EmailKhachHang { get; set; } = string.Empty;

        public string TrangThai { get; set; } = string.Empty;

        public string TrangThaiThanhToan { get; set; } = string.Empty;

        public string PhuongThucThanhToan { get; set; } = string.Empty;

        public decimal TongThanhToan { get; set; }

        public string TenNguoiNhan { get; set; } = string.Empty;

        public string SoDienThoaiNhan { get; set; } = string.Empty;

        public DateTimeOffset NgayTao { get; set; }
    }
}
