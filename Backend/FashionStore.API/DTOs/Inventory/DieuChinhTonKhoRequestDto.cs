using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Inventory
{
    public class DieuChinhTonKhoRequestDto
    {
        [Range(0, int.MaxValue,
            ErrorMessage = "Số lượng tồn mới không được âm.")]
        public int SoLuongMoi { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập lý do điều chỉnh.")]
        [StringLength(500,
            ErrorMessage = "Ghi chú tối đa 500 ký tự.")]
        public string GhiChu { get; set; } = string.Empty;
    }
}