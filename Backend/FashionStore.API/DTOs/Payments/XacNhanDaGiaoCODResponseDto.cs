
namespace FashionStore.API.DTOs.Payments
{
    public class XacNhanDaGiaoCODResponseDto
    {
        public Guid DonHangId { get; set; }

        public string MaDonHang { get; set; } = string.Empty;

        public string TrangThaiDonHang { get; set; } = string.Empty;

        public string TrangThaiThanhToan { get; set; } = string.Empty;

        public string TrangThaiGiaoDich { get; set; } = string.Empty;

        public string TrangThaiVanChuyen { get; set; } = string.Empty;

        public string PhuongThucThanhToan { get; set; } = string.Empty;

        public decimal SoTienDaThu { get; set; }

        public DateTimeOffset? ThoiDiemThanhToan { get; set; }

        public bool DaXacNhanTruocDo { get; set; }
    }
}
