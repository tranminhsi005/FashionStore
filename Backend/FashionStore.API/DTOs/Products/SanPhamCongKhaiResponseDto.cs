
namespace FashionStore.API.DTOs.Products
{
    public class SanPhamCongKhaiResponseDto
    {
        public Guid Id { get; set; }

        public string Ten { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public Guid DanhMucId { get; set; }

        public string TenDanhMuc { get; set; } = string.Empty;

        public Guid? ThuongHieuId { get; set; }

        public string? TenThuongHieu { get; set; }

        public string? ChatLieu { get; set; }

        public string? DoiTuong { get; set; }

        public bool NoiBat { get; set; }

        // Gia thap nhat trong cac bien the dang ban
        public decimal GiaThapNhat { get; set; }

        // Gia cao nhat trong cac bien the dang ban
        public decimal GiaCaoNhat { get; set; }

        // Co it nhat mot bien the con hang hay khong
        public bool ConHang { get; set; }

        // Anh dai dien
        public string? DuongDanAnhChinh { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}
