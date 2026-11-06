namespace FashionStore.API.Models.Entities
{
    public class ChiTietDonHang
    {
        public Guid Id { get; set; }

        public Guid DonHangId { get; set; }

        public Guid? SanPhamId { get; set; }

        public Guid? BienTheSanPhamId { get; set; }

        public string TenSanPham { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        public string? TenKichCo { get; set; }

        public string? TenMauSac { get; set; }

        public int SoLuong { get; set; }

        public decimal DonGia { get; set; }

        public decimal TienGiamGia { get; set; }

        public decimal ThanhTien { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DonHang DonHang { get; set; } = null!;

        public SanPham? SanPham { get; set; }

        public BienTheSanPham? BienTheSanPham { get; set; }

        public DanhGiaSanPham? DanhGiaSanPham { get; set; }
    }
}
