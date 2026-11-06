
using FashionStore.API.DTOs.Auth;

namespace FashionStore.API.Services
{
    public class AuthTokenResult
    {
        public DangNhapResponseDto Response { get; set; } = new();

        public string RefreshToken { get; set; } = string.Empty;

        public DateTimeOffset RefreshTokenHetHanLuc { get; set; }
    }
}
