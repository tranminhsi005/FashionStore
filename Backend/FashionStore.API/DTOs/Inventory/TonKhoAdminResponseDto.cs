namespace FashionStore.API.DTOs.Inventory
{
    public class TonKhoAdminResponseDto
    {
        public Guid BienTheSanPhamId { get; set; }

        public Guid SanPhamId { get; set; }

        public string TenSanPham { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        public Guid? KichCoId { get; set; }

        public string? TenKichCo { get; set; }

        public Guid? MauSacId { get; set; }

        public string? TenMauSac { get; set; }

        public string? MaHex { get; set; }

        public int SoLuongTon { get; set; }

        public bool DangBan { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }
    }
}