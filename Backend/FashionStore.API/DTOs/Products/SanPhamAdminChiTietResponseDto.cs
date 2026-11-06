
namespace FashionStore.API.DTOs.Products
{
    public class SanPhamAdminChiTietResponseDto
        : SanPhamAdminResponseDto
    {
        public List<BienTheSanPhamResponseDto> BienThes { get; set; }
            = new List<BienTheSanPhamResponseDto>();
    }
}
