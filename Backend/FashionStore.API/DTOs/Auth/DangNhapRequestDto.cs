
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Auth
{
    public class DangNhapRequestDto
    {
        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        public string MatKhau { get; set; } = string.Empty;
    }
}
