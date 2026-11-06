
namespace FashionStore.API.Models.Entities
{
    public class DiaChiGiaoHang
    {
        public Guid Id { get; set; }

        public Guid NguoiDungId { get; set; }

        public string TenNguoiNhan { get; set; } = string.Empty;

        public string SoDienThoai { get; set; } = string.Empty;

        public string TinhThanh { get; set; } = string.Empty;

        public string? QuanHuyen { get; set; }

        public string PhuongXa { get; set; } = string.Empty;

        public string DiaChiChiTiet { get; set; } = string.Empty;

        public bool LaMacDinh { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public NguoiDung NguoiDung { get; set; } = null!;
    }
}
