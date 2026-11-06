
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Products
{
    public class TaoBienTheSanPhamRequestDto
    {
        public Guid? KichCoId { get; set; }

        public Guid? MauSacId { get; set; }

        [Required(ErrorMessage = "SKU không được để trống.")]
        [StringLength(100)]
        public string Sku { get; set; } = string.Empty;

        [Range(0, double.MaxValue,
            ErrorMessage = "Giá bán không được âm.")]
        public decimal GiaBan { get; set; }

        [Range(0, double.MaxValue,
            ErrorMessage = "Giá niêm yết không được âm.")]
        public decimal? GiaNiemYet { get; set; }

        [Range(0, int.MaxValue,
            ErrorMessage = "Số lượng tồn không được âm.")]
        public int SoLuongTon { get; set; }
    }
}
