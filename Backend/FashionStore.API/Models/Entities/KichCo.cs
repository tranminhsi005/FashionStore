
namespace FashionStore.API.Models.Entities
{
    public class KichCo
    {
        public Guid Id { get; set; }

        public string Ma { get; set; } = string.Empty;

        public string TenHienThi { get; set; } = string.Empty;

        public int ThuTuHienThi { get; set; }

        public bool DangHoatDong { get; set; }

        public ICollection<BienTheSanPham> BienTheSanPhams { get; set; }
            = new List<BienTheSanPham>();
    }
}
