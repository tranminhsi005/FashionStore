
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Catalog
{
    public class MauSacRequestDto
    {
        [Required(ErrorMessage = "Tên màu sắc không được để trống.")]
        [StringLength(80)]
        public string Ten { get; set; } = string.Empty;

        [RegularExpression(
            @"^#[0-9A-Fa-f]{6}$",
            ErrorMessage = "Mã HEX phải có định dạng #RRGGBB."
        )]
        public string? MaHex { get; set; }

        [Range(0, int.MaxValue)]
        public int ThuTuHienThi { get; set; }
    }
}
