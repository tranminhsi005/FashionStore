
namespace FashionStore.API.DTOs.Products
{
    public class SanPhamAdminResponseDto
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

        public string TrangThai { get; set; } = string.Empty;

        public bool NoiBat { get; set; }

        public int TongSoBienThe { get; set; }

        public int SoBienTheDangBan { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }
    }
}
