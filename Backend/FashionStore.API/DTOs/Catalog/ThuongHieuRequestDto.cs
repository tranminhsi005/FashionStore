
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Catalog
{
    public class ThuongHieuRequestDto
    {
        [Required(ErrorMessage = "Tên thương hiệu không được để trống.")]
        [StringLength(150, MinimumLength = 2)]
        public string Ten { get; set; } = string.Empty;

        public string? MoTa { get; set; }
    }
}
