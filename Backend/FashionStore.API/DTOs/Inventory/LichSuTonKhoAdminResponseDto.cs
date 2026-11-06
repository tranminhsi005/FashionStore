namespace FashionStore.API.DTOs.Inventory
{
    public class LichSuTonKhoAdminResponseDto
    {
        public Guid Id { get; set; }

        public Guid BienTheSanPhamId { get; set; }

        public Guid? DonHangId { get; set; }

        public string TenSanPham { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        public int SoLuongThayDoi { get; set; }

        public string LoaiGiaoDich { get; set; } = string.Empty;

        public string? GhiChu { get; set; }

        public Guid? NguoiThucHienId { get; set; }

        public string? TenNguoiThucHien { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}