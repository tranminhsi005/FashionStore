
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Auth
{
    public class DangKyRequestDto
    {
        [Required(ErrorMessage = "Họ tên không được để trống.")]
        [StringLength(150, MinimumLength = 2)]
        public string HoTen { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        [StringLength(320)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        [StringLength(128, MinimumLength = 8)]
        public string MatKhau { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        [StringLength(30)]
        public string? SoDienThoai { get; set; }
    }
}
