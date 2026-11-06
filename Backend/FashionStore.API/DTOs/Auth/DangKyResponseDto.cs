
namespace FashionStore.API.DTOs.Auth
{
    public class DangKyResponseDto
    {
        public Guid Id { get; set; }

        public string HoTen { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? SoDienThoai { get; set; }

        public DateTimeOffset NgayTao { get; set; }
    }
}
