
namespace FashionStore.API.Models.Entities
{
    public class SanPham
    {
        public Guid Id { get; set; }

        public Guid DanhMucId { get; set; }

        public Guid? ThuongHieuId { get; set; }

        public string Ten { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        public string? ChatLieu { get; set; }

        public string? DoiTuong { get; set; }

        public string TrangThai { get; set; } = "nhap";

        public bool NoiBat { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        // Navigation properties

        public DanhMuc DanhMuc { get; set; } = null!;

        public ThuongHieu? ThuongHieu { get; set; }

        public ICollection<BienTheSanPham> BienTheSanPhams { get; set; }
            = new List<BienTheSanPham>();

        public ICollection<AnhSanPham> AnhSanPhams { get; set; }
            = new List<AnhSanPham>();

        public ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; }
            = new List<ChiTietDonHang>();


        public ICollection<SanPhamYeuThich> SanPhamYeuThiches { get; set; } = new List<SanPhamYeuThich>();
        public ICollection<DanhGiaSanPham> DanhGiaSanPhams { get; set; } = new List<DanhGiaSanPham>();
    }
}
