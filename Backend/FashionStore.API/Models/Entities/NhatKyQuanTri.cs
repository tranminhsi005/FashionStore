using System.Net;

namespace FashionStore.API.Models.Entities
{
    public class NhatKyQuanTri
    {
        public Guid Id { get; set; }

        public Guid? NguoiThucHienId { get; set; }

        public string HanhDong { get; set; } = string.Empty;

        public string DoiTuong { get; set; } = string.Empty;

        public Guid? DoiTuongId { get; set; }

        // Chuoi JSON; AppDbContext map hai truong nay sang PostgreSQL jsonb.
        // Hay serialize/deserialize bang System.Text.Json o Service.
        public string? DuLieuTruoc { get; set; }

        public string? DuLieuSau { get; set; }

        public IPAddress? DiaChiIp { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public NguoiDung? NguoiThucHien { get; set; }
    }
}
