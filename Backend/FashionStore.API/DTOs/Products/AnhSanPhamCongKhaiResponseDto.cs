
namespace FashionStore.API.DTOs.Products
{
    public class AnhSanPhamCongKhaiResponseDto
    {
        public Guid Id { get; set; }

        public string DuongDanAnh { get; set; } = string.Empty;

        public string? MoTaAnh { get; set; }

        public bool LaAnhChinh { get; set; }

        public int ThuTuHienThi { get; set; }

        public Guid? BienTheSanPhamId { get; set; }
    }
}
