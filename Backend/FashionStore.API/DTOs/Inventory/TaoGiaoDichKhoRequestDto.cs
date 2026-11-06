using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Inventory
{
    public class TaoGiaoDichKhoRequestDto
    {
        [Range(1, int.MaxValue,
            ErrorMessage = "Số lượng phải lớn hơn 0.")]
        public int SoLuong { get; set; }

        [StringLength(500,
            ErrorMessage = "Ghi chú tối đa 500 ký tự.")]
        public string? GhiChu { get; set; }
    }
}