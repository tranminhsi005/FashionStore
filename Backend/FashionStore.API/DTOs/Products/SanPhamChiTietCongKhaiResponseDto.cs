
namespace FashionStore.API.DTOs.Products
{
    public class SanPhamChiTietCongKhaiResponseDto
    {
        public Guid Id { get; set; }

        public string Ten { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public Guid DanhMucId { get; set; }

        public string TenDanhMuc { get; set; } = string.Empty;

        public Guid? ThuongHieuId { get; set; }

        public string? TenThuongHieu { get; set; }

        public string? MoTa { get; set; }

        public string? ChatLieu { get; set; }

        public string? DoiTuong { get; set; }

        public bool NoiBat { get; set; }

        public decimal GiaThapNhat { get; set; }

        public decimal GiaCaoNhat { get; set; }

        public bool ConHang { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public List<BienTheCongKhaiResponseDto> BienThes { get; set; }
            = new List<BienTheCongKhaiResponseDto>();

        public List<AnhSanPhamCongKhaiResponseDto> AnhSanPhams { get; set; }
            = new List<AnhSanPhamCongKhaiResponseDto>();
    }
}
