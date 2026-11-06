
namespace FashionStore.API.Models.Entities
{
    public class AnhSanPham
    {
        public Guid Id { get; set; }

        public Guid SanPhamId { get; set; }

        public Guid? BienTheSanPhamId { get; set; }

        public string DuongDanLuuTru { get; set; } = string.Empty;

        public string? MoTaAnh { get; set; }

        public bool LaAnhChinh { get; set; }

        public int ThuTuHienThi { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        // Navigation properties

        public SanPham SanPham { get; set; } = null!;

        public BienTheSanPham? BienTheSanPham { get; set; }
    }
}
