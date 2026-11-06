
namespace FashionStore.API.DTOs.Catalog
{
    public class ThuongHieuResponseDto
    {
        public Guid Id { get; set; }

        public string Ten { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        public string? DuongDanLogo { get; set; }

        public bool DangHoatDong { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}
