
using System.Net;

namespace FashionStore.API.Models.Entities
{
    public class PhienDangNhap
    {
        public Guid Id { get; set; }

        public Guid NguoiDungId { get; set; }

        public string RefreshTokenHash { get; set; } = string.Empty;

        public string? ThayTheBoiHash { get; set; }

        public string? ThietBi { get; set; }

        public IPAddress? DiaChiIp { get; set; }

        public DateTimeOffset HetHanLuc { get; set; }

        public DateTimeOffset? DaThuHoiLuc { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public NguoiDung NguoiDung { get; set; } = null!;
    }
}
