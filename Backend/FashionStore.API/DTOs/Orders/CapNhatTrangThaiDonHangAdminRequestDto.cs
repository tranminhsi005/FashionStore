
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Orders
{
    public class CapNhatTrangThaiDonHangAdminRequestDto
    {
        [Required]
        [RegularExpression(
            "^(da_xac_nhan|dang_chuan_bi)$",
            ErrorMessage = "Trạng thái đơn hàng không hợp lệ."
        )]
        public string TrangThaiMoi { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? GhiChu { get; set; }
    }
}
