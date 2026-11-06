
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Orders
{
    public class CapNhatVanChuyenAdminRequestDto
    {
        [RegularExpression(
        "^(da_lay_hang|dang_giao|giao_that_bai)$",
        ErrorMessage = "Trạng thái vận chuyển không hợp lệ."
        )]
        public string TrangThaiMoi { get; set; } = string.Empty;

        [StringLength(150)]
        public string? DonViVanChuyen { get; set; }

        [StringLength(150)]
        public string? MaVanDon { get; set; }

        [StringLength(1000)]
        public string? GhiChu { get; set; }
    }
}
