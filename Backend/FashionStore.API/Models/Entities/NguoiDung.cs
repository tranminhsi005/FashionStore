
namespace FashionStore.API.Models.Entities
{
    public class NguoiDung
    {
        public Guid Id { get; set; }

        public string HoTen { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string MatKhauHash { get; set; } = string.Empty;

        public string? SoDienThoai { get; set; }

        public bool EmailDaXacMinh { get; set; }

        public bool DangHoatDong { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public ICollection<NguoiDungVaiTro> NguoiDungVaiTros { get; set; }
            = new List<NguoiDungVaiTro>();

        public ICollection<PhienDangNhap> PhienDangNhaps { get; set; }
            = new List<PhienDangNhap>();

        public ICollection<DiaChiGiaoHang> DiaChiGiaoHangs { get; set; }
            = new List<DiaChiGiaoHang>();

        public GioHang? GioHang { get; set; }

        public ICollection<DonHang> DonHangs { get; set; }
            = new List<DonHang>();

        public ICollection<LichSuTrangThaiDonHang> LichSuTrangThaiDonHangs { get; set; } = new List<LichSuTrangThaiDonHang>();
        public ICollection<LichSuTonKho> LichSuTonKhos { get; set; } = new List<LichSuTonKho>();
        public ICollection<SanPhamYeuThich> SanPhamYeuThiches { get; set; } = new List<SanPhamYeuThich>();
        public ICollection<DanhGiaSanPham> DanhGiaSanPhams { get; set; } = new List<DanhGiaSanPham>();
        public ICollection<LichSuSuDungMaGiamGia> LichSuSuDungMaGiamGias { get; set; } = new List<LichSuSuDungMaGiamGia>();
        public ICollection<NhatKyQuanTri> NhatKyQuanTris { get; set; } = new List<NhatKyQuanTri>();
    }
}
