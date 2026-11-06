namespace FashionStore.API.Models.Entities
{
    public class DonHang
    {
        public Guid Id { get; set; }

        public string MaDonHang { get; set; } = string.Empty;

        public Guid NguoiDungId { get; set; }

        public Guid? MaGiamGiaId { get; set; }

        public string? MaGiamGiaDaApDung { get; set; }

        public string TrangThai { get; set; } = "cho_xac_nhan";

        public string TrangThaiThanhToan { get; set; } = "cho_thanh_toan";

        public string PhuongThucThanhToan { get; set; } = "cod";

        public decimal TongTienHang { get; set; }

        public decimal TienGiamGia { get; set; }

        public decimal PhiVanChuyen { get; set; }

        public decimal TongThanhToan { get; set; }

        public string TienTe { get; set; } = "VND";

        public string TenNguoiNhan { get; set; } = string.Empty;

        public string SoDienThoaiNhan { get; set; } = string.Empty;

        public string TinhThanhNhan { get; set; } = string.Empty;

        public string? QuanHuyenNhan { get; set; }

        public string PhuongXaNhan { get; set; } = string.Empty;

        public string DiaChiChiTietNhan { get; set; } = string.Empty;

        public string? GhiChuKhachHang { get; set; }

        public string? LyDoHuy { get; set; }

        public Guid? KhoaIdempotent { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public NguoiDung NguoiDung { get; set; } = null!;

        public MaGiamGia? MaGiamGia { get; set; }

        public ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; }
            = new List<ChiTietDonHang>();

        public ICollection<ThanhToan> ThanhToans { get; set; }
            = new List<ThanhToan>();

        public VanChuyen? VanChuyen { get; set; }

        public ICollection<LichSuTrangThaiDonHang> LichSuTrangThaiDonHangs { get; set; } = new List<LichSuTrangThaiDonHang>();
        public ICollection<LichSuTonKho> LichSuTonKhos { get; set; } = new List<LichSuTonKho>();
        public ICollection<LichSuSuDungMaGiamGia> LichSuSuDungMaGiamGias { get; set; } = new List<LichSuSuDungMaGiamGia>();
    }
}
