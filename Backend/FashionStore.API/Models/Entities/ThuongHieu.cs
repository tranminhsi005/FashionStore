
namespace FashionStore.API.Models.Entities
{
    public class ThuongHieu
    {
        public Guid Id { get; set; }

        public string Ten { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        public string? DuongDanLogo { get; set; }

        public bool DangHoatDong { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public ICollection<SanPham> SanPhams { get; set; }
            = new List<SanPham>();
    }
}
