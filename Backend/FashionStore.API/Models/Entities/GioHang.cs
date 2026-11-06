namespace FashionStore.API.Models.Entities
{
    public class GioHang
    {
        public Guid Id { get; set; }

        public Guid NguoiDungId { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public NguoiDung NguoiDung { get; set; } = null!;

        public ICollection<GioHangChiTiet> GioHangChiTiets { get; set; }
            = new List<GioHangChiTiet>();
    }
}
