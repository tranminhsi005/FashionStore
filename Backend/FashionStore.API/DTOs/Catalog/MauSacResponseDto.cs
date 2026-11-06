
namespace FashionStore.API.DTOs.Catalog
{
    public class MauSacResponseDto
    {
        public Guid Id { get; set; }

        public string Ten { get; set; } = string.Empty;

        public string? MaHex { get; set; }

        public int ThuTuHienThi { get; set; }

        public bool DangHoatDong { get; set; }
    }
}
