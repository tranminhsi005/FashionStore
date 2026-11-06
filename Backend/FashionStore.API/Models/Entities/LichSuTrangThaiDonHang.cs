namespace FashionStore.API.Models.Entities
{
    public class LichSuTrangThaiDonHang
    {
        public Guid Id { get; set; }

        public Guid DonHangId { get; set; }

        public string? TrangThaiCu { get; set; }

        public string TrangThaiMoi { get; set; } = string.Empty;

        public Guid? NguoiThucHienId { get; set; }

        public string? GhiChu { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DonHang DonHang { get; set; } = null!;

        public NguoiDung? NguoiThucHien { get; set; }
    }
}
