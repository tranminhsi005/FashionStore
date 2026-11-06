namespace FashionStore.API.DTOs.Inventory
{
    public class GiaoDichTonKhoResponseDto
    {
        public Guid BienTheSanPhamId { get; set; }

        public string Sku { get; set; } = string.Empty;

        public int SoLuongTruoc { get; set; }

        public int SoLuongThayDoi { get; set; }

        public int SoLuongSau { get; set; }

        public string LoaiGiaoDich { get; set; } = string.Empty;

        public string? GhiChu { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}