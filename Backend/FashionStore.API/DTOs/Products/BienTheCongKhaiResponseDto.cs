
namespace FashionStore.API.DTOs.Products
{
    public class BienTheCongKhaiResponseDto
    {
        public Guid Id { get; set; }

        public Guid? KichCoId { get; set; }

        public string? TenKichCo { get; set; }

        public Guid? MauSacId { get; set; }

        public string? TenMauSac { get; set; }

        public string? MaHex { get; set; }

        public decimal GiaBan { get; set; }

        public decimal? GiaNiemYet { get; set; }

        public bool ConHang { get; set; }
    }
}
