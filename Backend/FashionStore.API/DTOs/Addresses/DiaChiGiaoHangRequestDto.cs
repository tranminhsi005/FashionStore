using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Addresses
{
    public class DiaChiGiaoHangRequestDto
    {
        [Required(ErrorMessage = "Vui lòng nhập tên người nhận.")]
        [StringLength(150)]
        public string TenNguoiNhan { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
        [StringLength(30)]
        public string SoDienThoai { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập tỉnh/thành.")]
        [StringLength(150)]
        public string TinhThanh { get; set; } = string.Empty;

        [StringLength(150)]
        public string? QuanHuyen { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập phường/xã.")]
        [StringLength(150)]
        public string PhuongXa { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập địa chỉ chi tiết.")]
        [StringLength(300)]
        public string DiaChiChiTiet { get; set; } = string.Empty;

        public bool LaMacDinh { get; set; }
    }
}