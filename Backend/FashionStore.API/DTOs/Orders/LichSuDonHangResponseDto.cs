
namespace FashionStore.API.DTOs.Orders
{
    public class LichSuDonHangResponseDto
    {
        public string? TrangThaiCu { get; set; }

        public string TrangThaiMoi { get; set; } = string.Empty;

        public string? GhiChu { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}
