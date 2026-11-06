
namespace FashionStore.API.DTOs.Common
{
    public class PhanTrangResponseDto<T>
    {
        public List<T> Items { get; set; } = new();

        public int Trang { get; set; }

        public int KichThuocTrang { get; set; }

        public int TongSoBanGhi { get; set; }

        public int TongSoTrang { get; set; }
    }
}
