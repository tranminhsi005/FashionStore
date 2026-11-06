
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Products
{
    public class SanPhamQueryDto
    {
        // Trang hien tai
        [Range(1, int.MaxValue, ErrorMessage = "Trang phải lớn hơn 0.")]
        public int Trang { get; set; } = 1;

        // So san pham tren moi trang
        [Range(1, 50, ErrorMessage = "Kích thước trang từ 1 đến 50.")]
        public int KichThuocTrang { get; set; } = 12;

        // Tu khoa tim kiem
        [StringLength(150)]
        public string? TuKhoa { get; set; }

        // Loc danh muc
        public Guid? DanhMucId { get; set; }

        // Loc thuong hieu
        public Guid? ThuongHieuId { get; set; }

        // Loc kich co
        public Guid? KichCoId { get; set; }

        // Loc mau sac
        public Guid? MauSacId { get; set; }

        // Loc gia
        [Range(0, double.MaxValue)]
        public decimal? GiaTu { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? GiaDen { get; set; }

        // Sap xep
        public string SapXep { get; set; } = "moi-nhat";

        // Loc san pham noi bat
        public bool? NoiBat { get; set; }
    }
}
