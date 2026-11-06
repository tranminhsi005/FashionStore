
using System.ComponentModel.DataAnnotations;

namespace FashionStore.API.DTOs.Payments
{
    public class XacNhanDaGiaoCODRequestDto
    {
        public bool DaThuDuTien { get; set; }

        [StringLength(1000)]
        public string? GhiChu { get; set; }
    }
}
