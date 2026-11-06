
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Categories
{
    public class DanhMucRequestDto
    {
        [Required(ErrorMessage = "Tên danh mục không được để trống.")]
        [StringLength(150)]
        public string Ten { get; set; } = string.Empty;

        public Guid? DanhMucChaId { get; set; }

        public string? MoTa { get; set; }

        public int ThuTuHienThi { get; set; }
    }
}
