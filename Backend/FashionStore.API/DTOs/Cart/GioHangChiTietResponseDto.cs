namespace FashionStore.API.DTOs.Cart
{
    public class GioHangChiTietResponseDto
    {
        public Guid Id { get; set; }

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

        public string? DuongDanAnh { get; set; }

        public decimal GiaBan { get; set; }

        public decimal? GiaNiemYet { get; set; }

        public int SoLuong { get; set; }

        public int SoLuongTon { get; set; }

        public decimal ThanhTien { get; set; }

        public bool ConTheMua { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }
    }
}