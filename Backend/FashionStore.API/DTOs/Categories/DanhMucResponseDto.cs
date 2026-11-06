
namespace FashionStore.API.DTOs.Categories
{
    public class DanhMucResponseDto
    {
        public Guid Id { get; set; }

        public Guid? DanhMucChaId { get; set; }

        public string TenDanhMucCha { get; set; } = string.Empty;

        public string Ten { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        public int ThuTuHienThi { get; set; }

        public bool DangHoatDong { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}
