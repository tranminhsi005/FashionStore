namespace FashionStore.API.DTOs.Cart
{
    public class GioHangResponseDto
    {
        public Guid Id { get; set; }

        public List<GioHangChiTietResponseDto> Items { get; set; } = new List<GioHangChiTietResponseDto>();

        public int TongSoLuong { get; set; }

        public decimal TongTien { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }
    }
}