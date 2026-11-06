namespace FashionStore.API.Models.Entities
{
    public class MaGiamGia
    {
        public Guid Id { get; set; }

        public string Ma { get; set; } = string.Empty;

        public string Ten { get; set; } = string.Empty;

        public string LoaiGiamGia { get; set; } = string.Empty;

        public decimal GiaTri { get; set; }

        public decimal DonHangToiThieu { get; set; }

        public decimal? TienGiamToiDa { get; set; }

        public int? SoLuotSuDungToiDa { get; set; }

        public int SoLuotDaSuDung { get; set; }

        public int MoiNguoiSuDungToiDa { get; set; }

        public DateTimeOffset BatDauLuc { get; set; }

        public DateTimeOffset KetThucLuc { get; set; }

        public bool DangHoatDong { get; set; }

        public DateTimeOffset NgayTao { get; set; }

        public DateTimeOffset NgayCapNhat { get; set; }

        public ICollection<DonHang> DonHangs { get; set; }
            = new List<DonHang>();

        public ICollection<LichSuSuDungMaGiamGia> LichSuSuDungMaGiamGias { get; set; } = new List<LichSuSuDungMaGiamGia>();
    }
}
