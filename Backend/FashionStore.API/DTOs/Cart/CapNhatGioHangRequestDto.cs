using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Cart
{
    public class CapNhatGioHangRequestDto
    {
        [Range(1, int.MaxValue,
            ErrorMessage = "Số lượng phải lớn hơn 0.")]
        public int SoLuong { get; set; }
    }
}