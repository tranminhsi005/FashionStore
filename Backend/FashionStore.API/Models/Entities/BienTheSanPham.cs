
namespace FashionStore.API.Models.Entities
{
    public class BienTheSanPham
    {
        public Guid Id { get; set; }

        public Guid SanPhamId { get; set; }

        public Guid? KichCoId { get; set; }

        public Guid? MauSacId { get; set; }

        public string Sku { get; set; } = string.Empty;

        public decimal GiaBan { get; set; }

        public decimal? GiaNiemYet { get; set; }

        public int SoLuongTon { get; set; }

        public bool DangBan { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        // Navigation properties

        public SanPham SanPham { get; set; } = null!;

        public KichCo? KichCo { get; set; }

        public MauSac? MauSac { get; set; }

        public ICollection<AnhSanPham> AnhSanPhams { get; set; }
            = new List<AnhSanPham>();

        public ICollection<GioHangChiTiet> GioHangChiTiets { get; set; }
            = new List<GioHangChiTiet>();

        public ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; }
            = new List<ChiTietDonHang>();

        public ICollection<LichSuTonKho> LichSuTonKhos { get; set; } = new List<LichSuTonKho>();
    }
}
