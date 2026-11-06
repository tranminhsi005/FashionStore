
using FashionStore.API.Data;
using FashionStore.API.DTOs.Cart;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Services
{
    public class GioHangService : IGioHangService
    {
        private readonly AppDbContext _context;
        private readonly ISupabaseStorageService _storage;

        public GioHangService(
            AppDbContext context,
            ISupabaseStorageService storage)
        {
            _context = context;
            _storage = storage;
        }

        // =====================================================
        // 1. LAY GIO HANG
        // =====================================================

        public async Task<GioHangResponseDto> LayGioHangAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                var gioHang = await LayHoacTaoGioHangDaKhoaAsync(
                    nguoiDungId,
                    cancellationToken
                );

                var ketQua = await TaoResponseAsync(
                    gioHang,
                    cancellationToken
                );

                await transaction.CommitAsync(cancellationToken);

                return ketQua;
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 2. THEM SAN PHAM VAO GIO HANG
        // =====================================================

        public async Task<GioHangResponseDto> ThemVaoGioHangAsync(
            Guid nguoiDungId,
            ThemVaoGioHangRequestDto request,
            CancellationToken cancellationToken)
        {
            if (request.SoLuong <= 0)
            {
                throw new GioHangServiceException(
                    "Số lượng phải lớn hơn 0."
                );
            }

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                var gioHang = await LayHoacTaoGioHangDaKhoaAsync(
                    nguoiDungId,
                    cancellationToken
                );

                // Khoa bien the de kiem tra ton kho an toan
                var bienThe = await LayBienTheDaKhoaAsync(
                    request.BienTheSanPhamId,
                    cancellationToken
                );

                if (bienThe == null)
                {
                    throw new GioHangServiceException(
                        "Không tìm thấy biến thể sản phẩm.",
                        404
                    );
                }

                await KiemTraBienTheCoTheMuaAsync(
                    bienThe,
                    cancellationToken
                );

                // Tim dong gio hang da co
                var dongGioHang = await _context.GioHangChiTiets
                    .FirstOrDefaultAsync(
                        x =>
                            x.GioHangId == gioHang.Id &&
                            x.BienTheSanPhamId == bienThe.Id,
                        cancellationToken
                    );

                int soLuongCu = dongGioHang?.SoLuong ?? 0;

                long soLuongMoiLong =
                    (long)soLuongCu + request.SoLuong;

                if (soLuongMoiLong > int.MaxValue)
                {
                    throw new GioHangServiceException(
                        "Số lượng sản phẩm vượt quá giới hạn.",
                        409
                    );
                }

                int soLuongMoi = (int)soLuongMoiLong;

                if (soLuongMoi > bienThe.SoLuongTon)
                {
                    throw new GioHangServiceException(
                        $"Không đủ hàng trong kho. " +
                        $"Hiện chỉ còn {bienThe.SoLuongTon} sản phẩm.",
                        409
                    );
                }

                DateTimeOffset hienTai = DateTimeOffset.UtcNow;

                if (dongGioHang == null)
                {
                    dongGioHang = new GioHangChiTiet
                    {
                        Id = Guid.NewGuid(),

                        GioHangId = gioHang.Id,

                        BienTheSanPhamId = bienThe.Id,

                        SoLuong = request.SoLuong,

                        NgayTao = hienTai,

                        NgayCapNhat = hienTai
                    };

                    _context.GioHangChiTiets.Add(dongGioHang);
                }
                else
                {
                    dongGioHang.SoLuong = soLuongMoi;

                    dongGioHang.NgayCapNhat = hienTai;
                }

                gioHang.NgayCapNhat = hienTai;

                await _context.SaveChangesAsync(cancellationToken);

                var ketQua = await TaoResponseAsync(
                    gioHang,
                    cancellationToken
                );

                await transaction.CommitAsync(cancellationToken);

                return ketQua;
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 3. CAP NHAT SO LUONG SAN PHAM TRONG GIO
        // =====================================================

        public async Task<GioHangResponseDto> CapNhatSoLuongAsync(
            Guid nguoiDungId,
            Guid chiTietId,
            CapNhatGioHangRequestDto request,
            CancellationToken cancellationToken)
        {
            if (request.SoLuong <= 0)
            {
                throw new GioHangServiceException(
                    "Số lượng phải lớn hơn 0."
                );
            }

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                var gioHang = await LayHoacTaoGioHangDaKhoaAsync(
                    nguoiDungId,
                    cancellationToken
                );

                // Chi duoc sua dong thuoc gio hang cua minh
                var dongGioHang = await _context.GioHangChiTiets
                    .FirstOrDefaultAsync(
                        x =>
                            x.Id == chiTietId &&
                            x.GioHangId == gioHang.Id,
                        cancellationToken
                    );

                if (dongGioHang == null)
                {
                    throw new GioHangServiceException(
                        "Không tìm thấy sản phẩm trong giỏ hàng.",
                        404
                    );
                }

                var bienThe = await LayBienTheDaKhoaAsync(
                    dongGioHang.BienTheSanPhamId,
                    cancellationToken
                );

                if (bienThe == null)
                {
                    throw new GioHangServiceException(
                        "Biến thể sản phẩm không còn tồn tại.",
                        404
                    );
                }

                await KiemTraBienTheCoTheMuaAsync(
                    bienThe,
                    cancellationToken
                );

                if (request.SoLuong > bienThe.SoLuongTon)
                {
                    throw new GioHangServiceException(
                        $"Không đủ hàng trong kho. " +
                        $"Hiện chỉ còn {bienThe.SoLuongTon} sản phẩm.",
                        409
                    );
                }

                DateTimeOffset hienTai = DateTimeOffset.UtcNow;

                dongGioHang.SoLuong = request.SoLuong;

                dongGioHang.NgayCapNhat = hienTai;

                gioHang.NgayCapNhat = hienTai;

                await _context.SaveChangesAsync(cancellationToken);

                var ketQua = await TaoResponseAsync(
                    gioHang,
                    cancellationToken
                );

                await transaction.CommitAsync(cancellationToken);

                return ketQua;
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 4. XOA MOT SAN PHAM KHOI GIO HANG
        // =====================================================

        public async Task<GioHangResponseDto> XoaSanPhamAsync(
            Guid nguoiDungId,
            Guid chiTietId,
            CancellationToken cancellationToken)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                var gioHang = await LayHoacTaoGioHangDaKhoaAsync(
                    nguoiDungId,
                    cancellationToken
                );

                var dongGioHang = await _context.GioHangChiTiets
                    .FirstOrDefaultAsync(
                        x =>
                            x.Id == chiTietId &&
                            x.GioHangId == gioHang.Id,
                        cancellationToken
                    );

                if (dongGioHang == null)
                {
                    throw new GioHangServiceException(
                        "Không tìm thấy sản phẩm trong giỏ hàng.",
                        404
                    );
                }

                _context.GioHangChiTiets.Remove(dongGioHang);

                gioHang.NgayCapNhat = DateTimeOffset.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                var ketQua = await TaoResponseAsync(
                    gioHang,
                    cancellationToken
                );

                await transaction.CommitAsync(cancellationToken);

                return ketQua;
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 5. XOA TOAN BO GIO HANG
        // =====================================================

        public async Task<GioHangResponseDto> XoaTatCaAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                var gioHang = await LayHoacTaoGioHangDaKhoaAsync(
                    nguoiDungId,
                    cancellationToken
                );

                var danhSach = await _context.GioHangChiTiets
                    .Where(x => x.GioHangId == gioHang.Id)
                    .ToListAsync(cancellationToken);

                if (danhSach.Count > 0)
                {
                    _context.GioHangChiTiets.RemoveRange(danhSach);

                    gioHang.NgayCapNhat = DateTimeOffset.UtcNow;

                    await _context.SaveChangesAsync(cancellationToken);
                }

                var ketQua = await TaoResponseAsync(
                    gioHang,
                    cancellationToken
                );

                await transaction.CommitAsync(cancellationToken);

                return ketQua;
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 6. LAY HOAC TAO GIO HANG VA KHOA DONG
        // =====================================================

        private async Task<GioHang> LayHoacTaoGioHangDaKhoaAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken)
        {
            // Khoa dong nguoi dung.
            // Moi request cua cung mot nguoi dung se duoc xu ly tuan tu.
            var nguoiDung = await _context.NguoiDungs
                .FromSqlInterpolated(
                    $@"SELECT *
                       FROM public.nguoi_dung
                       WHERE id = {nguoiDungId}
                       FOR UPDATE"
                )
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            if (nguoiDung.Count == 0 ||
                !nguoiDung[0].DangHoatDong)
            {
                throw new GioHangServiceException(
                    "Tài khoản không tồn tại hoặc đã bị khóa.",
                    401
                );
            }

            // Tim gio hang va khoa dong.
            var danhSachGioHang = await _context.GioHangs
                .FromSqlInterpolated(
                    $@"SELECT *
                       FROM public.gio_hang
                       WHERE nguoi_dung_id = {nguoiDungId}
                       FOR UPDATE"
                )
                .ToListAsync(cancellationToken);

            var gioHang = danhSachGioHang.FirstOrDefault();

            // Neu chua co gio hang thi tao moi.
            if (gioHang == null)
            {
                DateTimeOffset hienTai = DateTimeOffset.UtcNow;

                gioHang = new GioHang
                {
                    Id = Guid.NewGuid(),

                    NguoiDungId = nguoiDungId,

                    NgayTao = hienTai,

                    NgayCapNhat = hienTai
                };

                _context.GioHangs.Add(gioHang);

                await _context.SaveChangesAsync(cancellationToken);
            }

            return gioHang;
        }

        // =====================================================
        // 7. LAY BIEN THE VA KHOA TON KHO
        // =====================================================

        private async Task<BienTheSanPham?> LayBienTheDaKhoaAsync(
            Guid bienTheId,
            CancellationToken cancellationToken)
        {
            var danhSach = await _context.BienTheSanPhams
                .FromSqlInterpolated(
                    $@"SELECT *
                       FROM public.bien_the_san_pham
                       WHERE id = {bienTheId}
                       FOR UPDATE"
                )
                .ToListAsync(cancellationToken);

            return danhSach.FirstOrDefault();
        }

        // =====================================================
        // 8. KIEM TRA SAN PHAM CO THE MUA HAY KHONG
        // =====================================================

        private async Task KiemTraBienTheCoTheMuaAsync(
            BienTheSanPham bienThe,
            CancellationToken cancellationToken)
        {
            if (!bienThe.DangBan)
            {
                throw new GioHangServiceException(
                    "Biến thể sản phẩm hiện không còn kinh doanh.",
                    409
                );
            }

            bool sanPhamDangBan = await _context.SanPhams
                .AsNoTracking()
                .AnyAsync(
                    x =>
                        x.Id == bienThe.SanPhamId &&
                        x.TrangThai == "dang_ban",
                    cancellationToken
                );

            if (!sanPhamDangBan)
            {
                throw new GioHangServiceException(
                    "Sản phẩm hiện không còn kinh doanh.",
                    409
                );
            }

            if (bienThe.SoLuongTon <= 0)
            {
                throw new GioHangServiceException(
                    "Sản phẩm hiện đã hết hàng.",
                    409
                );
            }
        }

        // =====================================================
        // 9. TAO RESPONSE GIO HANG
        // =====================================================

        private async Task<GioHangResponseDto> TaoResponseAsync(
            GioHang gioHang,
            CancellationToken cancellationToken)
        {
            var danhSach = await _context.GioHangChiTiets
                .AsNoTracking()
                .Where(x => x.GioHangId == gioHang.Id)
                .OrderBy(x => x.NgayTao)
                .Select(x => new GioHangChiTietResponseDto
                {
                    Id = x.Id,

                    BienTheSanPhamId = x.BienTheSanPhamId,

                    SanPhamId = x.BienTheSanPham.SanPhamId,

                    TenSanPham = x.BienTheSanPham.SanPham.Ten,

                    Slug = x.BienTheSanPham.SanPham.Slug,

                    Sku = x.BienTheSanPham.Sku,

                    KichCoId = x.BienTheSanPham.KichCoId,

                    TenKichCo = x.BienTheSanPham.KichCo != null
                        ? x.BienTheSanPham.KichCo.TenHienThi
                        : null,

                    MauSacId = x.BienTheSanPham.MauSacId,

                    TenMauSac = x.BienTheSanPham.MauSac != null
                        ? x.BienTheSanPham.MauSac.Ten
                        : null,

                    MaHex = x.BienTheSanPham.MauSac != null
                        ? x.BienTheSanPham.MauSac.MaHex
                        : null,

                    DuongDanAnh = x.BienTheSanPham.SanPham.AnhSanPhams
                        .Where(a => a.LaAnhChinh)
                        .Select(a => a.DuongDanLuuTru)
                        .FirstOrDefault(),

                    GiaBan = x.BienTheSanPham.GiaBan,

                    GiaNiemYet = x.BienTheSanPham.GiaNiemYet,

                    SoLuong = x.SoLuong,

                    SoLuongTon = x.BienTheSanPham.SoLuongTon,

                    ThanhTien =
                        x.BienTheSanPham.GiaBan * x.SoLuong,

                    ConTheMua =
                        x.BienTheSanPham.DangBan &&
                        x.BienTheSanPham.SanPham.TrangThai == "dang_ban" &&
                        x.BienTheSanPham.SoLuongTon >= x.SoLuong,

                    NgayCapNhat = x.NgayCapNhat
                })
                .ToListAsync(cancellationToken);

            // Chuyen duong dan tuong doi thanh URL Supabase
            foreach (var item in danhSach)
            {
                if (!string.IsNullOrWhiteSpace(item.DuongDanAnh))
                {
                    item.DuongDanAnh =
                        _storage.TaoUrlCongKhai(item.DuongDanAnh);
                }
            }

            int tongSoLuong = danhSach.Sum(x => x.SoLuong);

            decimal tongTien = danhSach.Sum(x => x.ThanhTien);

            return new GioHangResponseDto
            {
                Id = gioHang.Id,

                Items = danhSach,

                TongSoLuong = tongSoLuong,

                TongTien = tongTien,

                NgayCapNhat = gioHang.NgayCapNhat
            };
        }
    }
}
