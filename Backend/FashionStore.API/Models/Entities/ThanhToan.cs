namespace FashionStore.API.Models.Entities
{
    public class ThanhToan
    {
        public Guid Id { get; set; }

        public Guid DonHangId { get; set; }

        public string? CongThanhToan { get; set; }

        public string PhuongThuc { get; set; } = string.Empty;

        public decimal SoTien { get; set; }

        public string TienTe { get; set; } = "VND";

        public string TrangThai { get; set; } = "cho_thanh_toan";

        public string? MaGiaoDichNhaCungCap { get; set; }

        public string? KhoaIdempotent { get; set; }

        public DateTimeOffset? ThoiDiemThanhToan { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public DonHang DonHang { get; set; } = null!;
    }
}
