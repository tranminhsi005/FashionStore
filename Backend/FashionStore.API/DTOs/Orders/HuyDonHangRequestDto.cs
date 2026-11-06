
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Orders
{
    public class HuyDonHangRequestDto
    {
        [Required(ErrorMessage = "Vui lòng nhập lý do hủy đơn hàng.")]
        [StringLength(
            500,
            MinimumLength = 3,
            ErrorMessage = "Lý do hủy phải từ 3 đến 500 ký tự."
        )]
        public string LyDoHuy { get; set; } = string.Empty;
    }
}
