namespace FashionStore.API.Models.Entities
{
    public class GioHangChiTiet
    {
        public Guid Id { get; set; }

        public Guid GioHangId { get; set; }

        public Guid BienTheSanPhamId { get; set; }

        public int SoLuong { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public GioHang GioHang { get; set; } = null!;

        public BienTheSanPham BienTheSanPham { get; set; } = null!;
    }
}
