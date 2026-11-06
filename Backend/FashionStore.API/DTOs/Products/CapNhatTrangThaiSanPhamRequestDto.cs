
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Products
{
    public class CapNhatTrangThaiSanPhamRequestDto
    {
        [Required]
        [RegularExpression(
            "^(nhap|dang_ban|an|ngung_kinh_doanh)$",
            ErrorMessage = "Trạng thái sản phẩm không hợp lệ."
        )]
        public string TrangThai { get; set; } = string.Empty;
    }
}
