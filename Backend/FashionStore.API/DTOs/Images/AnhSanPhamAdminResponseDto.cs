namespace FashionStore.API.DTOs.Images
{
    public class AnhSanPhamAdminResponseDto
    {
        public Guid Id { get; set; }

        public Guid SanPhamId { get; set; }

        public string DuongDanAnh { get; set; } = string.Empty;

        public string? MoTaAnh { get; set; }

        public bool LaAnhChinh { get; set; }

        public int ThuTuHienThi { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}