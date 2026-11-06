namespace FashionStore.API.Models.Entities
{
    public class SanPhamYeuThich
    {
        public Guid NguoiDungId { get; set; }

        public Guid SanPhamId { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public NguoiDung NguoiDung { get; set; } = null!;

        public SanPham SanPham { get; set; } = null!;
    }
}
