
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Products
{
    public class CapNhatBienTheRequestDto
    {
        [Required(ErrorMessage = "SKU không được để trống.")]
        [StringLength(100)]
        public string Sku { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal GiaBan { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? GiaNiemYet { get; set; }

        public bool DangBan { get; set; }
    }
}
