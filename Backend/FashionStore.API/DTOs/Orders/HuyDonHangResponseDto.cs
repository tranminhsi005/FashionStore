
namespace FashionStore.API.DTOs.Orders
{
    public class HuyDonHangResponseDto
    {
        public Guid DonHangId { get; set; }

        public string MaDonHang { get; set; } = string.Empty;

        public string TrangThai { get; set; } = string.Empty;

        public string LyDoHuy { get; set; } = string.Empty;

        public string? TrangThaiVanChuyen { get; set; }

        public int TongSoLuongHoanKho { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        // True nếu đơn đã được hủy từ request trước đó.
        // Không thực hiện cộng kho thêm lần nữa.
        public bool DaHuyTruocDo { get; set; }
    }
}
