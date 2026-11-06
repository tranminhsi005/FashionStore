using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace FashionStore.API.DTOs.Images
{
    public class TaoAnhSanPhamRequestDto
    {
        [Required(ErrorMessage = "Vui lòng chọn ảnh.")]
        public IFormFile File { get; set; } = null!;

        [StringLength(200, ErrorMessage = "Mô tả ảnh tối đa 200 ký tự.")]
        public string? MoTaAnh { get; set; }

        public bool LaAnhChinh { get; set; }

        [Range(0, 1000, ErrorMessage = "Thứ tự hiển thị không hợp lệ.")]
        public int ThuTuHienThi { get; set; }
    }
}