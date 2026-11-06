namespace FashionStore.API.Models.Entities
{
    public class LichSuTonKho
    {
        public Guid Id { get; set; }

        public Guid BienTheSanPhamId { get; set; }

        public Guid? DonHangId { get; set; }

        public Guid? NguoiThucHienId { get; set; }

        public int SoLuongThayDoi { get; set; }

        public string LoaiGiaoDich { get; set; } = string.Empty;

        public string? GhiChu { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public BienTheSanPham BienTheSanPham { get; set; } = null!;

        public DonHang? DonHang { get; set; }

        public NguoiDung? NguoiThucHien { get; set; }
    }
}
