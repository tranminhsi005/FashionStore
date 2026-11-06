
namespace FashionStore.API.Models.Entities
{
    public class DanhMuc
    {
        public Guid Id { get; set; }

        public Guid? DanhMucChaId { get; set; }

        public string Ten { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        public int ThuTuHienThi { get; set; }

        public bool DangHoatDong { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        // Danh muc cha
        public DanhMuc? DanhMucCha { get; set; }

        // Danh sach danh muc con
        public ICollection<DanhMuc> DanhMucCon { get; set; }
            = new List<DanhMuc>();

        // Danh sach san pham
        public ICollection<SanPham> SanPhams { get; set; }
            = new List<SanPham>();
    }
}
