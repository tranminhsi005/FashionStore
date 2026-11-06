
namespace FashionStore.API.DTOs.Auth
{
    public class NguoiDungResponseDto
    {
        public Guid Id { get; set; }

        public string HoTen { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? SoDienThoai { get; set; }

        public List<string> VaiTros { get; set; } = new();

        public DateTimeOffset NgayTao { get; set; }
    }
}
