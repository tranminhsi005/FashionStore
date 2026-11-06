
namespace FashionStore.API.DTOs.Catalog
{
    public class KichCoResponseDto
    {
        public Guid Id { get; set; }

        public string Ma { get; set; } = string.Empty;

        public string TenHienThi { get; set; } = string.Empty;

        public int ThuTuHienThi { get; set; }

        public bool DangHoatDong { get; set; }
    }
}
