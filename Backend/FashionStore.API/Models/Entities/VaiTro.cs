
namespace FashionStore.API.Models.Entities
{
    public class VaiTro
    {
        public Guid Id { get; set; }

        public string Ma { get; set; } = string.Empty;

        public string Ten { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        public DateTimeOffset NgayTao { get; set; }
        public ICollection<NguoiDungVaiTro> NguoiDungVaiTros { get; set; }
            = new List<NguoiDungVaiTro>();
    }
}
