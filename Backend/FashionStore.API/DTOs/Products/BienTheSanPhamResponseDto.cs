
namespace FashionStore.API.DTOs.Products
{
    public class BienTheSanPhamResponseDto
    {
        public Guid Id { get; set; }

        public Guid? KichCoId { get; set; }

        public string? TenKichCo { get; set; }

        public Guid? MauSacId { get; set; }

        public string? TenMauSac { get; set; }

        public string? MaHex { get; set; }

        public string Sku { get; set; } = string.Empty;

        public decimal GiaBan { get; set; }

        public decimal? GiaNiemYet { get; set; }

        public int SoLuongTon { get; set; }

        public bool DangBan { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}
