namespace FashionStore.API.Models.Entities
{
    public class DanhGiaSanPham
    {
        public Guid Id { get; set; }

        public Guid NguoiDungId { get; set; }

        public Guid SanPhamId { get; set; }

        public Guid ChiTietDonHangId { get; set; }

        public short SoSao { get; set; }

        public string? NoiDung { get; set; }

        public string TrangThai { get; set; } = "cho_duyet";

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public NguoiDung NguoiDung { get; set; } = null!;

        public SanPham SanPham { get; set; } = null!;

        public ChiTietDonHang ChiTietDonHang { get; set; } = null!;
    }
}
