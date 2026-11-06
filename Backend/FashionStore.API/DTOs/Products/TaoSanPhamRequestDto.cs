
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Products
{
    public class TaoSanPhamRequestDto
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống.")]
        [StringLength(250, MinimumLength = 2)]
        public string Ten { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng chọn danh mục.")]
        public Guid DanhMucId { get; set; }

        public Guid? ThuongHieuId { get; set; }

        public string? MoTa { get; set; }

        [StringLength(200)]
        public string? ChatLieu { get; set; }

        [RegularExpression(
            "^(nam|nu|unisex|tre_em|khac)$",
            ErrorMessage = "Đối tượng không hợp lệ."
        )]
        public string? DoiTuong { get; set; }

        public bool NoiBat { get; set; }

        [Required(ErrorMessage = "Sản phẩm cần có ít nhất một biến thể.")]
        [MinLength(1, ErrorMessage = "Sản phẩm cần có ít nhất một biến thể.")]
        public List<TaoBienTheSanPhamRequestDto> BienThes { get; set; }
            = new List<TaoBienTheSanPhamRequestDto>();
    }
}
