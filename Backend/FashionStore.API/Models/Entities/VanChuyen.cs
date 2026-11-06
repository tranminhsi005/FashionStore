namespace FashionStore.API.Models.Entities
{
    public class VanChuyen
    {
        public Guid Id { get; set; }

        public Guid DonHangId { get; set; }

        public string? DonViVanChuyen { get; set; }

        public string? MaVanDon { get; set; }

        public string TrangThai { get; set; } = "cho_xu_ly";

        public DateTimeOffset? ThoiDiemGuiHang { get; set; }

        public DateTimeOffset? ThoiDiemGiaoHang { get; set; }

        public string? GhiChu { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public DonHang DonHang { get; set; } = null!;
    }
}
