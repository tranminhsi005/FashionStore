
namespace FashionStore.API.DTOs.Orders
{
    public class DonHangAdminChiTietResponseDto : DonHangResponseDto
    {
        public Guid NguoiDungId { get; set; }

        public string TenKhachHang { get; set; } = string.Empty;

        public string EmailKhachHang { get; set; } = string.Empty;
    }
}
