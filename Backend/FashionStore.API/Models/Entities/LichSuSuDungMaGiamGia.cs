namespace FashionStore.API.Models.Entities
{
    public class LichSuSuDungMaGiamGia
    {
        public Guid Id { get; set; }

        public Guid MaGiamGiaId { get; set; }

        public Guid DonHangId { get; set; }

        public Guid NguoiDungId { get; set; }

        public decimal SoTienDuocGiam { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public MaGiamGia MaGiamGia { get; set; } = null!;

        public DonHang DonHang { get; set; } = null!;

        public NguoiDung NguoiDung { get; set; } = null!;
    }
}
