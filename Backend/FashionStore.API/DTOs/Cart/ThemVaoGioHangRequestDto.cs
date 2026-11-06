using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Cart
{
    public class ThemVaoGioHangRequestDto
    {
        [Required(ErrorMessage = "Vui lòng chọn biến thể sản phẩm.")]
        public Guid BienTheSanPhamId { get; set; }

        [Range(1, int.MaxValue,
            ErrorMessage = "Số lượng phải lớn hơn 0.")]
        public int SoLuong { get; set; } = 1;
    }
}