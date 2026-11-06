
namespace FashionStore.API.Models.Entities
{
    public class MauSac
    {
        public Guid Id { get; set; }

        public string Ten { get; set; } = string.Empty;

        public string? MaHex { get; set; }

        public int ThuTuHienThi { get; set; }

        public bool DangHoatDong { get; set; }

        public ICollection<BienTheSanPham> BienTheSanPhams { get; set; }
            = new List<BienTheSanPham>();
    }
}
