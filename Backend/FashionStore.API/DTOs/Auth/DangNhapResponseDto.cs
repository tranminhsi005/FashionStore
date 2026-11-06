
namespace FashionStore.API.DTOs.Auth
{
    public class DangNhapResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;

        public string TokenType { get; set; } = "Bearer";

        public int ExpiresIn { get; set; }

        public NguoiDungResponseDto NguoiDung { get; set; } = new();
    }
}
