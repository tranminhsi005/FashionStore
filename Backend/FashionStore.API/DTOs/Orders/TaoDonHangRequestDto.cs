
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Orders
{
    public class TaoDonHangRequestDto
    {
        [Required]
        public Guid DiaChiGiaoHangId { get; set; }

        [RegularExpression(
        "^cod$",
        ErrorMessage = "Hiện tại chỉ hỗ trợ thanh toán tiền mặt khi nhận hàng (COD)."
        )]
        public string PhuongThucThanhToan { get; set; } = "cod";

        [StringLength(1000)]
        public string? GhiChuKhachHang { get; set; }

        [Required]
        public Guid KhoaIdempotent { get; set; }
    }
}
