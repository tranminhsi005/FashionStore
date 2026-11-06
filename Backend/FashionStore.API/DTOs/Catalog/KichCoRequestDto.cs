
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Catalog
{
    public class KichCoRequestDto
    {
        [Required(ErrorMessage = "Mã kích cỡ không được để trống.")]
        [StringLength(30)]
        [RegularExpression(
            @"^[a-zA-Z0-9_-]+$",
            ErrorMessage = "Mã kích cỡ chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới."
        )]
        public string Ma { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên kích cỡ không được để trống.")]
        [StringLength(50)]
        public string TenHienThi { get; set; } = string.Empty;

        [Range(0, int.MaxValue)]
        public int ThuTuHienThi { get; set; }
    }
}
