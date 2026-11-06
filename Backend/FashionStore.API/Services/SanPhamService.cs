
using FashionStore.API.Data;
using FashionStore.API.DTOs.Common;
using FashionStore.API.DTOs.Products;
using FashionStore.API.Helpers;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace FashionStore.API.Services
{
    public class SanPhamService : ISanPhamService
    {
        private readonly AppDbContext _context;
        private readonly ISupabaseStorageService _storage;

        public SanPhamService(
            AppDbContext context,
            ISupabaseStorageService storage)
        {
            _context = context;
            _storage = storage;
        }

        // =====================================================
        // 1. LAY DANH SACH SAN PHAM ADMIN
        // =====================================================

        public async Task<List<SanPhamAdminResponseDto>>
            LayDanhSachAdminAsync(
                string? tuKhoa,
                CancellationToken cancellationToken)
        {
            var query = _context.SanPhams
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(tuKhoa))
            {
                string tuKhoaTimKiem = tuKhoa.Trim().ToLower();

                query = query.Where(x =>
                    x.Ten.ToLower().Contains(tuKhoaTimKiem) ||
                    x.BienTheSanPhams.Any(b =>
                        b.Sku.ToLower().Contains(tuKhoaTimKiem)
                    )
                );
            }

            return await query
                .OrderByDescending(x => x.NgayTao)
                .Take(100)
                .Select(x => new SanPhamAdminResponseDto
                {
                    Id = x.Id,
                    Ten = x.Ten,
                    Slug = x.Slug,

                    DanhMucId = x.DanhMucId,
                    TenDanhMuc = x.DanhMuc.Ten,

                    ThuongHieuId = x.ThuongHieuId,
                    TenThuongHieu = x.ThuongHieu != null
                        ? x.ThuongHieu.Ten
                        : null,

                    MoTa = x.MoTa,
                    ChatLieu = x.ChatLieu,
                    DoiTuong = x.DoiTuong,
                    TrangThai = x.TrangThai,
                    NoiBat = x.NoiBat,

                    TongSoBienThe = x.BienTheSanPhams.Count(),

                    SoBienTheDangBan = x.BienTheSanPhams.Count(
                        b => b.DangBan
                    ),

                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToListAsync(cancellationToken);
        }

        // =====================================================
        // 2. LAY CHI TIET SAN PHAM ADMIN
        // =====================================================

        public async Task<SanPhamAdminChiTietResponseDto?>
            LayChiTietAdminAsync(
                Guid id,
                CancellationToken cancellationToken)
        {
            var sanPham = await _context.SanPhams
                .AsNoTracking()
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.BienTheSanPhams)
                    .ThenInclude(x => x.KichCo)
                .Include(x => x.BienTheSanPhams)
                    .ThenInclude(x => x.MauSac)
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (sanPham == null)
            {
                return null;
            }

            var ketQua = TaoResponseSanPham(sanPham);

            ketQua.BienThes = sanPham.BienTheSanPhams
                .OrderBy(x => x.NgayTao)
                .Select(x => TaoResponseBienThe(x))
                .ToList();

            return ketQua;
        }

        // =====================================================
        // 3. TAO SAN PHAM VA NHIEU BIEN THE
        // =====================================================

        public async Task<SanPhamAdminChiTietResponseDto> TaoAsync(
            TaoSanPhamRequestDto dto,
            CancellationToken cancellationToken)
        {
            string ten = dto.Ten.Trim();

            if (string.IsNullOrWhiteSpace(ten))
            {
                throw new CatalogServiceException(
                    400,
                    "Tên sản phẩm không được để trống."
                );
            }

            if (dto.BienThes == null || dto.BienThes.Count == 0)
            {
                throw new CatalogServiceException(
                    400,
                    "Sản phẩm phải có ít nhất một biến thể."
                );
            }

            await KiemTraDanhMucVaThuongHieuAsync(
                dto.DanhMucId,
                dto.ThuongHieuId,
                cancellationToken
            );

            await KiemTraDanhSachBienTheAsync(
                dto.BienThes,
                cancellationToken
            );

            string slug = await TaoSlugKhongTrungAsync(
                ten,
                cancellationToken
            );

            DateTimeOffset hienTai = DateTimeOffset.UtcNow;

            var sanPham = new SanPham
            {
                Id = Guid.NewGuid(),
                DanhMucId = dto.DanhMucId,
                ThuongHieuId = dto.ThuongHieuId,
                Ten = ten,
                Slug = slug,
                MoTa = dto.MoTa?.Trim(),
                ChatLieu = dto.ChatLieu?.Trim(),
                DoiTuong = dto.DoiTuong,
                TrangThai = "nhap",
                NoiBat = dto.NoiBat,
                NgayTao = hienTai,
                NgayCapNhat = hienTai
            };

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                _context.SanPhams.Add(sanPham);

                foreach (var dtoBienThe in dto.BienThes)
                {
                    var bienThe = new BienTheSanPham
                    {
                        Id = Guid.NewGuid(),
                        SanPhamId = sanPham.Id,
                        KichCoId = dtoBienThe.KichCoId,
                        MauSacId = dtoBienThe.MauSacId,
                        Sku = dtoBienThe.Sku.Trim(),
                        GiaBan = dtoBienThe.GiaBan,
                        GiaNiemYet = dtoBienThe.GiaNiemYet,
                        SoLuongTon = dtoBienThe.SoLuongTon,
                        DangBan = true,
                        NgayTao = hienTai,
                        NgayCapNhat = hienTai
                    };

                    _context.BienTheSanPhams.Add(bienThe);

                    if (bienThe.SoLuongTon > 0)
                    {
                        _context.LichSuTonKhos.Add(new LichSuTonKho
                        {
                            Id = Guid.NewGuid(),

                            BienTheSanPhamId = bienThe.Id,

                            DonHangId = null,

                            NguoiThucHienId = null,

                            SoLuongThayDoi = bienThe.SoLuongTon,

                            LoaiGiaoDich = "nhap_hang",

                            GhiChu = "Tồn kho ban đầu khi tạo biến thể.",

                            NgayTao = hienTai
                        });
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
                when (ex.InnerException is PostgresException pg &&
                      pg.SqlState == PostgresErrorCodes.UniqueViolation)
            {
                await transaction.RollbackAsync(cancellationToken);

                throw new CatalogServiceException(
                    409,
                    "SKU, slug hoặc tổ hợp kích cỡ và màu sắc đã tồn tại."
                );
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }

            return (await LayChiTietAdminAsync(
                sanPham.Id,
                cancellationToken
            ))!;
        }

        // =====================================================
        // 4. CAP NHAT THONG TIN SAN PHAM
        // =====================================================

        public async Task<SanPhamAdminChiTietResponseDto?>
            CapNhatAsync(
                Guid id,
                CapNhatSanPhamRequestDto dto,
                CancellationToken cancellationToken)
        {
            var sanPham = await _context.SanPhams
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (sanPham == null)
            {
                return null;
            }

            await KiemTraDanhMucVaThuongHieuAsync(
                dto.DanhMucId,
                dto.ThuongHieuId,
                cancellationToken
            );

            string ten = dto.Ten.Trim();

            if (string.IsNullOrWhiteSpace(ten))
            {
                throw new CatalogServiceException(
                    400,
                    "Tên sản phẩm không được để trống."
                );
            }

            sanPham.DanhMucId = dto.DanhMucId;
            sanPham.ThuongHieuId = dto.ThuongHieuId;
            sanPham.Ten = ten;

            // Khong thay doi slug sau khi da tao.

            sanPham.MoTa = dto.MoTa?.Trim();
            sanPham.ChatLieu = dto.ChatLieu?.Trim();
            sanPham.DoiTuong = dto.DoiTuong;
            sanPham.NoiBat = dto.NoiBat;
            sanPham.NgayCapNhat = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return await LayChiTietAdminAsync(
                id,
                cancellationToken
            );
        }

        // =====================================================
        // 5. CAP NHAT TRANG THAI SAN PHAM
        // =====================================================

        public async Task<SanPhamAdminChiTietResponseDto?>
            CapNhatTrangThaiAsync(
                Guid id,
                CapNhatTrangThaiSanPhamRequestDto dto,
                CancellationToken cancellationToken)
        {
            var sanPham = await _context.SanPhams
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (sanPham == null)
            {
                return null;
            }

            string[] trangThaiHopLe =
            {
                "nhap",
                "dang_ban",
                "an",
                "ngung_kinh_doanh"
            };

            if (!trangThaiHopLe.Contains(dto.TrangThai))
            {
                throw new CatalogServiceException(
                    400,
                    "Trạng thái sản phẩm không hợp lệ."
                );
            }

            if (dto.TrangThai == "dang_ban")
            {
                bool coBienThe = await _context.BienTheSanPhams
                    .AnyAsync(
                        x => x.SanPhamId == id && x.DangBan,
                        cancellationToken
                    );

                if (!coBienThe)
                {
                    throw new CatalogServiceException(
                        409,
                        "Sản phẩm cần có ít nhất một biến thể đang bán."
                    );
                }
            }

            sanPham.TrangThai = dto.TrangThai;
            sanPham.NgayCapNhat = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return await LayChiTietAdminAsync(
                id,
                cancellationToken
            );
        }

        // =====================================================
        // 6. THEM BIEN THE VAO SAN PHAM
        // =====================================================

        public async Task<BienTheSanPhamResponseDto>
            ThemBienTheAsync(
                Guid sanPhamId,
                TaoBienTheSanPhamRequestDto dto,
                CancellationToken cancellationToken)
        {
            var sanPham = await _context.SanPhams
                .FirstOrDefaultAsync(
                    x => x.Id == sanPhamId,
                    cancellationToken
                );

            if (sanPham == null)
            {
                throw new CatalogServiceException(
                    404,
                    "Không tìm thấy sản phẩm."
                );
            }

            if (sanPham.TrangThai == "ngung_kinh_doanh")
            {
                throw new CatalogServiceException(
                    409,
                    "Không thể thêm biến thể cho sản phẩm đã ngừng kinh doanh."
                );
            }

            await KiemTraDanhSachBienTheAsync(
                new List<TaoBienTheSanPhamRequestDto> { dto },
                cancellationToken
            );

            bool trungToHop = await _context.BienTheSanPhams
                .AnyAsync(
                    x =>
                        x.SanPhamId == sanPhamId &&
                        x.KichCoId == dto.KichCoId &&
                        x.MauSacId == dto.MauSacId,
                    cancellationToken
                );

            if (trungToHop)
            {
                throw new CatalogServiceException(
                    409,
                    "Tổ hợp kích cỡ và màu sắc đã tồn tại trong sản phẩm."
                );
            }

            DateTimeOffset hienTai = DateTimeOffset.UtcNow;

            var bienThe = new BienTheSanPham
            {
                Id = Guid.NewGuid(),
                SanPhamId = sanPhamId,
                KichCoId = dto.KichCoId,
                MauSacId = dto.MauSacId,
                Sku = dto.Sku.Trim(),
                GiaBan = dto.GiaBan,
                GiaNiemYet = dto.GiaNiemYet,
                SoLuongTon = dto.SoLuongTon,
                DangBan = true,
                NgayTao = hienTai,
                NgayCapNhat = hienTai
            };

            _context.BienTheSanPhams.Add(bienThe);

            if (bienThe.SoLuongTon > 0)
            {
                _context.LichSuTonKhos.Add(new LichSuTonKho
                {
                    Id = Guid.NewGuid(),

                    BienTheSanPhamId = bienThe.Id,

                    DonHangId = null,

                    NguoiThucHienId = null,

                    SoLuongThayDoi = bienThe.SoLuongTon,

                    LoaiGiaoDich = "nhap_hang",

                    GhiChu = "Tồn kho ban đầu khi thêm biến thể.",

                    NgayTao = hienTai
                });
            }

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
                when (ex.InnerException is PostgresException pg &&
                      pg.SqlState == PostgresErrorCodes.UniqueViolation)
            {
                throw new CatalogServiceException(
                    409,
                    "SKU hoặc tổ hợp biến thể đã tồn tại."
                );
            }

            var ketQua = await _context.BienTheSanPhams
                .AsNoTracking()
                .Include(x => x.KichCo)
                .Include(x => x.MauSac)
                .FirstAsync(
                    x => x.Id == bienThe.Id,
                    cancellationToken
                );

            return TaoResponseBienThe(ketQua);
        }

        // =====================================================
        // 7. CAP NHAT BIEN THE
        // =====================================================

        public async Task<BienTheSanPhamResponseDto?>
            CapNhatBienTheAsync(
                Guid id,
                CapNhatBienTheRequestDto dto,
                CancellationToken cancellationToken)
        {
            var bienThe = await _context.BienTheSanPhams
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (bienThe == null)
            {
                return null;
            }

            string sku = dto.Sku.Trim();

            bool skuDaTonTai = await _context.BienTheSanPhams
                .AnyAsync(
                    x => x.Id != id &&
                         x.Sku.ToLower() == sku.ToLower(),
                    cancellationToken
                );

            if (skuDaTonTai)
            {
                throw new CatalogServiceException(
                    409,
                    "SKU đã được sử dụng."
                );
            }

            KiemTraGiaBienThe(
                dto.GiaBan,
                dto.GiaNiemYet,
                0
            );

            if (!dto.DangBan && bienThe.DangBan)
            {
                var sanPham = await _context.SanPhams
                    .FirstAsync(
                        x => x.Id == bienThe.SanPhamId,
                        cancellationToken
                    );

                if (sanPham.TrangThai == "dang_ban")
                {
                    int soBienTheDangBan = await _context.BienTheSanPhams
                        .CountAsync(
                            x => x.SanPhamId == bienThe.SanPhamId &&
                                 x.DangBan,
                            cancellationToken
                        );

                    if (soBienTheDangBan <= 1)
                    {
                        throw new CatalogServiceException(
                            409,
                            "Không thể ngừng biến thể cuối cùng khi sản phẩm đang kinh doanh."
                        );
                    }
                }
            }

            bienThe.Sku = sku;
            bienThe.GiaBan = dto.GiaBan;
            bienThe.GiaNiemYet = dto.GiaNiemYet;
            bienThe.DangBan = dto.DangBan;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
                when (ex.InnerException is PostgresException pg &&
                      pg.SqlState == PostgresErrorCodes.UniqueViolation)
            {
                throw new CatalogServiceException(
                    409,
                    "SKU đã được sử dụng."
                );
            }

            var ketQua = await _context.BienTheSanPhams
                .AsNoTracking()
                .Include(x => x.KichCo)
                .Include(x => x.MauSac)
                .FirstAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            return TaoResponseBienThe(ketQua);
        }

        // =====================================================
        // 8. NGUNG KINH DOANH BIEN THE
        // =====================================================

        public async Task<bool> NgungBienTheAsync(
            Guid id,
            CancellationToken cancellationToken)
        {
            var bienThe = await _context.BienTheSanPhams
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (bienThe == null)
            {
                return false;
            }

            if (!bienThe.DangBan)
            {
                return true;
            }

            var sanPham = await _context.SanPhams
                .FirstAsync(
                    x => x.Id == bienThe.SanPhamId,
                    cancellationToken
                );

            if (sanPham.TrangThai == "dang_ban")
            {
                int soBienTheDangBan = await _context.BienTheSanPhams
                    .CountAsync(
                        x => x.SanPhamId == bienThe.SanPhamId &&
                             x.DangBan,
                        cancellationToken
                    );

                if (soBienTheDangBan <= 1)
                {
                    throw new CatalogServiceException(
                        409,
                        "Không thể ngừng biến thể cuối cùng khi sản phẩm đang kinh doanh. Hãy ẩn hoặc ngừng kinh doanh sản phẩm trước."
                    );
                }
            }

            bienThe.DangBan = false;
            bienThe.NgayCapNhat = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }

        // =====================================================
        // CAC HAM KIEM TRA DU LIEU
        // =====================================================

        private async Task KiemTraDanhMucVaThuongHieuAsync(
            Guid danhMucId,
            Guid? thuongHieuId,
            CancellationToken cancellationToken)
        {
            bool danhMucHopLe = await _context.DanhMucs
                .AnyAsync(
                    x => x.Id == danhMucId &&
                         x.DangHoatDong,
                    cancellationToken
                );

            if (!danhMucHopLe)
            {
                throw new CatalogServiceException(
                    400,
                    "Danh mục không tồn tại hoặc đã ngừng hoạt động."
                );
            }

            if (thuongHieuId.HasValue)
            {
                bool thuongHieuHopLe = await _context.ThuongHieus
                    .AnyAsync(
                        x => x.Id == thuongHieuId.Value &&
                             x.DangHoatDong,
                        cancellationToken
                    );

                if (!thuongHieuHopLe)
                {
                    throw new CatalogServiceException(
                        400,
                        "Thương hiệu không tồn tại hoặc đã ngừng hoạt động."
                    );
                }
            }
        }

        private async Task KiemTraDanhSachBienTheAsync(
            List<TaoBienTheSanPhamRequestDto> danhSach,
            CancellationToken cancellationToken)
        {
            if (danhSach == null || danhSach.Count == 0)
            {
                throw new CatalogServiceException(
                    400,
                    "Phải có ít nhất một biến thể."
                );
            }

            var danhSachSku = new HashSet<string>(
                StringComparer.OrdinalIgnoreCase
            );

            var danhSachToHop = new HashSet<string>(
                StringComparer.OrdinalIgnoreCase
            );

            foreach (var x in danhSach)
            {
                string sku = x.Sku?.Trim() ?? string.Empty;

                if (string.IsNullOrWhiteSpace(sku))
                {
                    throw new CatalogServiceException(
                        400,
                        "SKU không được để trống."
                    );
                }

                if (!danhSachSku.Add(sku))
                {
                    throw new CatalogServiceException(
                        409,
                        $"SKU {sku} bị trùng trong danh sách biến thể."
                    );
                }

                KiemTraGiaBienThe(
                    x.GiaBan,
                    x.GiaNiemYet,
                    x.SoLuongTon
                );

                string toHop =
                    $"{x.KichCoId?.ToString() ?? "null"}_" +
                    $"{x.MauSacId?.ToString() ?? "null"}";

                if (!danhSachToHop.Add(toHop))
                {
                    throw new CatalogServiceException(
                        409,
                        "Tổ hợp kích cỡ và màu sắc bị trùng trong sản phẩm."
                    );
                }
            }

            var cacSku = danhSachSku
                .Select(x => x.ToLower())
                .ToList();

            bool skuDaTonTai = await _context.BienTheSanPhams
                .AnyAsync(
                    x => cacSku.Contains(x.Sku.ToLower()),
                    cancellationToken
                );

            if (skuDaTonTai)
            {
                throw new CatalogServiceException(
                    409,
                    "Một hoặc nhiều SKU đã tồn tại trong hệ thống."
                );
            }

            var cacKichCoId = danhSach
                .Where(x => x.KichCoId.HasValue)
                .Select(x => x.KichCoId!.Value)
                .Distinct()
                .ToList();

            if (cacKichCoId.Count > 0)
            {
                var kichCoHopLe = await _context.KichCos
                    .Where(x =>
                        cacKichCoId.Contains(x.Id) &&
                        x.DangHoatDong
                    )
                    .Select(x => x.Id)
                    .ToListAsync(cancellationToken);

                if (kichCoHopLe.Count != cacKichCoId.Count)
                {
                    throw new CatalogServiceException(
                        400,
                        "Có kích cỡ không tồn tại hoặc đã ngừng hoạt động."
                    );
                }
            }

            var cacMauSacId = danhSach
                .Where(x => x.MauSacId.HasValue)
                .Select(x => x.MauSacId!.Value)
                .Distinct()
                .ToList();

            if (cacMauSacId.Count > 0)
            {
                var mauSacHopLe = await _context.MauSacs
                    .Where(x =>
                        cacMauSacId.Contains(x.Id) &&
                        x.DangHoatDong
                    )
                    .Select(x => x.Id)
                    .ToListAsync(cancellationToken);

                if (mauSacHopLe.Count != cacMauSacId.Count)
                {
                    throw new CatalogServiceException(
                        400,
                        "Có màu sắc không tồn tại hoặc đã ngừng hoạt động."
                    );
                }
            }
        }

        private static void KiemTraGiaBienThe(
            decimal giaBan,
            decimal? giaNiemYet,
            int soLuongTon)
        {
            if (giaBan < 0)
            {
                throw new CatalogServiceException(
                    400,
                    "Giá bán không được âm."
                );
            }

            if (giaNiemYet.HasValue &&
                giaNiemYet.Value < giaBan)
            {
                throw new CatalogServiceException(
                    400,
                    "Giá niêm yết phải lớn hơn hoặc bằng giá bán."
                );
            }

            if (soLuongTon < 0)
            {
                throw new CatalogServiceException(
                    400,
                    "Số lượng tồn không được âm."
                );
            }
        }

        // =====================================================
        // TAO SLUG KHONG TRUNG
        // =====================================================

        private async Task<string> TaoSlugKhongTrungAsync(
            string ten,
            CancellationToken cancellationToken)
        {
            string slugGoc = SlugHelper.TaoSlug(ten);

            if (string.IsNullOrWhiteSpace(slugGoc))
            {
                throw new CatalogServiceException(
                    400,
                    "Không thể tạo slug từ tên sản phẩm."
                );
            }

            string slug = slugGoc;
            int soThuTu = 2;

            while (await _context.SanPhams
                .AnyAsync(x => x.Slug == slug, cancellationToken))
            {
                slug = $"{slugGoc}-{soThuTu}";
                soThuTu++;
            }

            return slug;
        }

        // =====================================================
        // CAC HAM TAO RESPONSE DTO
        // =====================================================

        private static SanPhamAdminChiTietResponseDto TaoResponseSanPham(
            SanPham x)
        {
            return new SanPhamAdminChiTietResponseDto
            {
                Id = x.Id,
                Ten = x.Ten,
                Slug = x.Slug,

                DanhMucId = x.DanhMucId,
                TenDanhMuc = x.DanhMuc.Ten,

                ThuongHieuId = x.ThuongHieuId,
                TenThuongHieu = x.ThuongHieu?.Ten,

                MoTa = x.MoTa,
                ChatLieu = x.ChatLieu,
                DoiTuong = x.DoiTuong,
                TrangThai = x.TrangThai,
                NoiBat = x.NoiBat,

                TongSoBienThe = x.BienTheSanPhams.Count,

                SoBienTheDangBan = x.BienTheSanPhams.Count(
                    b => b.DangBan
                ),

                NgayTao = x.NgayTao,
                NgayCapNhat = x.NgayCapNhat
            };
        }

        private static BienTheSanPhamResponseDto TaoResponseBienThe(
            BienTheSanPham x)
        {
            return new BienTheSanPhamResponseDto
            {
                Id = x.Id,

                KichCoId = x.KichCoId,
                TenKichCo = x.KichCo?.TenHienThi,

                MauSacId = x.MauSacId,
                TenMauSac = x.MauSac?.Ten,
                MaHex = x.MauSac?.MaHex,

                Sku = x.Sku,
                GiaBan = x.GiaBan,
                GiaNiemYet = x.GiaNiemYet,
                SoLuongTon = x.SoLuongTon,
                DangBan = x.DangBan,
                NgayTao = x.NgayTao
            };
        }

        // =====================================================
        // 9. DANH SACH SAN PHAM CONG KHAI
        // =====================================================

        public async Task<PhanTrangResponseDto<SanPhamCongKhaiResponseDto>>
            LayDanhSachCongKhaiAsync(
                SanPhamQueryDto query,
                CancellationToken cancellationToken)
        {
            if (query.GiaTu.HasValue &&
                query.GiaDen.HasValue &&
                query.GiaTu.Value > query.GiaDen.Value)
            {
                throw new CatalogServiceException(
                    400,
                    "Giá từ không được lớn hơn giá đến."
                );
            }

            int trang = query.Trang;
            int kichThuocTrang = query.KichThuocTrang;

            if (trang < 1 || kichThuocTrang < 1 || kichThuocTrang > 50)
            {
                throw new CatalogServiceException(
                    400,
                    "Thông tin phân trang không hợp lệ."
                );
            }

            // Tránh tràn số khi tính vị trí Skip.
            long viTriBoQua = ((long)trang - 1) * kichThuocTrang;

            if (viTriBoQua > int.MaxValue)
            {
                throw new CatalogServiceException(
                    400,
                    "Số trang vượt quá giới hạn."
                );
            }

            string sapXep = query.SapXep.Trim().ToLowerInvariant();

            string[] cacKieuSapXep =
            {
                "moi-nhat",
                "cu-nhat",
                "gia-tang",
                "gia-giam",
                "ten-a-z",
                "ten-z-a"
            };

            if (!cacKieuSapXep.Contains(sapXep))
            {
                throw new CatalogServiceException(
                    400,
                    "Kiểu sắp xếp không hợp lệ."
                );
            }

            var danhSach = _context.SanPhams
                .AsNoTracking()
                .Where(x =>
                    x.TrangThai == "dang_ban" &&
                    x.BienTheSanPhams.Any(b => b.DangBan)
                );

            // LOC TU KHOA
            if (!string.IsNullOrWhiteSpace(query.TuKhoa))
            {
                string tuKhoa = query.TuKhoa.Trim().ToLower();

                danhSach = danhSach.Where(x =>
                    x.Ten.ToLower().Contains(tuKhoa) ||
                    (x.MoTa != null &&
                     x.MoTa.ToLower().Contains(tuKhoa)) ||
                    x.BienTheSanPhams.Any(b =>
                        b.DangBan &&
                        b.Sku.ToLower().Contains(tuKhoa)
                    )
                );
            }

            // LOC DANH MUC
            if (query.DanhMucId.HasValue)
            {
                danhSach = danhSach.Where(x =>
                    x.DanhMucId == query.DanhMucId.Value
                );
            }

            // LOC THUONG HIEU
            if (query.ThuongHieuId.HasValue)
            {
                danhSach = danhSach.Where(x =>
                    x.ThuongHieuId == query.ThuongHieuId.Value
                );
            }

            // LOC SIZE, MAU SAC VA GIA
            bool coBoLocBienThe =
                query.KichCoId.HasValue ||
                query.MauSacId.HasValue ||
                query.GiaTu.HasValue ||
                query.GiaDen.HasValue;

            if (coBoLocBienThe)
            {
                danhSach = danhSach.Where(x =>
                    x.BienTheSanPhams.Any(b =>
                        b.DangBan &&

                        (!query.KichCoId.HasValue ||
                         b.KichCoId == query.KichCoId.Value) &&

                        (!query.MauSacId.HasValue ||
                         b.MauSacId == query.MauSacId.Value) &&

                        (!query.GiaTu.HasValue ||
                         b.GiaBan >= query.GiaTu.Value) &&

                        (!query.GiaDen.HasValue ||
                         b.GiaBan <= query.GiaDen.Value)
                    )
                );
            }

            // LOC SAN PHAM NOI BAT
            if (query.NoiBat.HasValue)
            {
                danhSach = danhSach.Where(x =>
                    x.NoiBat == query.NoiBat.Value
                );
            }

            int tongSoBanGhi = await danhSach.CountAsync(
                cancellationToken
            );

            // SAP XEP
            IOrderedQueryable<SanPham> danhSachSapXep;

            switch (sapXep)
            {
                case "cu-nhat":
                    danhSachSapXep = danhSach
                        .OrderBy(x => x.NgayTao);
                    break;

                case "gia-tang":
                    danhSachSapXep = danhSach
                        .OrderBy(x =>
                            x.BienTheSanPhams
                                .Where(b => b.DangBan)
                                .Min(b => (decimal?)b.GiaBan)
                        );
                    break;

                case "gia-giam":
                    danhSachSapXep = danhSach
                        .OrderByDescending(x =>
                            x.BienTheSanPhams
                                .Where(b => b.DangBan)
                                .Min(b => (decimal?)b.GiaBan)
                        );
                    break;

                case "ten-a-z":
                    danhSachSapXep = danhSach
                        .OrderBy(x => x.Ten);
                    break;

                case "ten-z-a":
                    danhSachSapXep = danhSach
                        .OrderByDescending(x => x.Ten);
                    break;

                default:
                    danhSachSapXep = danhSach
                        .OrderByDescending(x => x.NgayTao);
                    break;
            }

            danhSachSapXep = danhSachSapXep
                .ThenBy(x => x.Id);

            // CHUYEN DU LIEU SANG DTO
            var danhSachSanPham = await danhSachSapXep
                .Skip((int)viTriBoQua)
                .Take(kichThuocTrang)
                .Select(x => new SanPhamCongKhaiResponseDto
                {
                    Id = x.Id,
                    Ten = x.Ten,
                    Slug = x.Slug,

                    DanhMucId = x.DanhMucId,
                    TenDanhMuc = x.DanhMuc.Ten,

                    ThuongHieuId = x.ThuongHieuId,
                    TenThuongHieu = x.ThuongHieu != null
                        ? x.ThuongHieu.Ten
                        : null,

                    ChatLieu = x.ChatLieu,
                    DoiTuong = x.DoiTuong,
                    NoiBat = x.NoiBat,

                    GiaThapNhat = x.BienTheSanPhams
                        .Where(b => b.DangBan)
                        .Min(b => (decimal?)b.GiaBan) ?? 0,

                    GiaCaoNhat = x.BienTheSanPhams
                        .Where(b => b.DangBan)
                        .Max(b => (decimal?)b.GiaBan) ?? 0,

                    ConHang = x.BienTheSanPhams.Any(
                        b => b.DangBan && b.SoLuongTon > 0
                    ),

                    DuongDanAnhChinh = x.AnhSanPhams
                        .Where(a => a.LaAnhChinh)
                        .Select(a => a.DuongDanLuuTru)
                        .FirstOrDefault(),

                    NgayTao = x.NgayTao
                })
                .ToListAsync(cancellationToken);

            // CHUYEN DUONG DAN STORAGE THANH URL CONG KHAI
            foreach (var sanPham in danhSachSanPham)
            {
                if (!string.IsNullOrWhiteSpace(
                    sanPham.DuongDanAnhChinh))
                {
                    sanPham.DuongDanAnhChinh =
                        _storage.TaoUrlCongKhai(
                            sanPham.DuongDanAnhChinh
                        );
                }
            }

            int tongSoTrang = (int)Math.Ceiling(
                tongSoBanGhi / (double)kichThuocTrang
            );

            return new PhanTrangResponseDto<SanPhamCongKhaiResponseDto>
            {
                Items = danhSachSanPham,
                Trang = trang,
                KichThuocTrang = kichThuocTrang,
                TongSoBanGhi = tongSoBanGhi,
                TongSoTrang = tongSoTrang
            };
        }

        // =====================================================
        // 10. CHI TIET SAN PHAM CONG KHAI
        // =====================================================

        public async Task<SanPhamChiTietCongKhaiResponseDto?>
            LayChiTietCongKhaiAsync(
                string slug,
                CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(slug))
            {
                return null;
            }

            slug = slug.Trim().ToLowerInvariant();

            var sanPham = await _context.SanPhams
                .AsNoTracking()
                .Where(x =>
                    x.Slug == slug &&
                    x.TrangThai == "dang_ban" &&
                    x.BienTheSanPhams.Any(b => b.DangBan)
                )
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.BienTheSanPhams)
                    .ThenInclude(x => x.KichCo)
                .Include(x => x.BienTheSanPhams)
                    .ThenInclude(x => x.MauSac)
                .Include(x => x.AnhSanPhams)
                .FirstOrDefaultAsync(cancellationToken);

            if (sanPham == null)
            {
                return null;
            }

            var cacBienThe = sanPham.BienTheSanPhams
                .Where(x => x.DangBan)
                .ToList();

            decimal giaThapNhat = cacBienThe.Min(x => x.GiaBan);
            decimal giaCaoNhat = cacBienThe.Max(x => x.GiaBan);

            var ketQua = new SanPhamChiTietCongKhaiResponseDto
            {
                Id = sanPham.Id,
                Ten = sanPham.Ten,
                Slug = sanPham.Slug,

                DanhMucId = sanPham.DanhMucId,
                TenDanhMuc = sanPham.DanhMuc.Ten,

                ThuongHieuId = sanPham.ThuongHieuId,
                TenThuongHieu = sanPham.ThuongHieu?.Ten,

                MoTa = sanPham.MoTa,
                ChatLieu = sanPham.ChatLieu,
                DoiTuong = sanPham.DoiTuong,
                NoiBat = sanPham.NoiBat,

                GiaThapNhat = giaThapNhat,
                GiaCaoNhat = giaCaoNhat,

                ConHang = cacBienThe.Any(x => x.SoLuongTon > 0),

                NgayTao = sanPham.NgayTao,

                // DANH SACH BIEN THE
                BienThes = cacBienThe
                    .OrderBy(x => x.KichCo != null
                        ? x.KichCo.ThuTuHienThi
                        : int.MaxValue)
                    .ThenBy(x => x.MauSac != null
                        ? x.MauSac.ThuTuHienThi
                        : int.MaxValue)
                    .Select(x => new BienTheCongKhaiResponseDto
                    {
                        Id = x.Id,

                        KichCoId = x.KichCoId,
                        TenKichCo = x.KichCo?.TenHienThi,

                        MauSacId = x.MauSacId,
                        TenMauSac = x.MauSac?.Ten,
                        MaHex = x.MauSac?.MaHex,

                        GiaBan = x.GiaBan,
                        GiaNiemYet = x.GiaNiemYet,
                        ConHang = x.SoLuongTon > 0
                    })
                    .ToList(),

                AnhSanPhams = sanPham.AnhSanPhams
                    .OrderByDescending(x => x.LaAnhChinh)
                    .ThenBy(x => x.ThuTuHienThi)
                    .Select(x => new AnhSanPhamCongKhaiResponseDto
                    {
                        Id = x.Id,
                        DuongDanAnh = x.DuongDanLuuTru,
                        MoTaAnh = x.MoTaAnh,
                        LaAnhChinh = x.LaAnhChinh,
                        ThuTuHienThi = x.ThuTuHienThi,
                        BienTheSanPhamId = x.BienTheSanPhamId
                    })
                    .ToList()
            };

            // CHUYEN DUONG DAN STORAGE THANH URL CONG KHAI
            foreach (var anh in ketQua.AnhSanPhams)
            {
                if (!string.IsNullOrWhiteSpace(anh.DuongDanAnh))
                {
                    anh.DuongDanAnh =
                        _storage.TaoUrlCongKhai(anh.DuongDanAnh);
                }
            }

            return ketQua;
        }

        // =====================================================
        // 11. SAN PHAM NOI BAT
        // =====================================================

        public async Task<List<SanPhamCongKhaiResponseDto>>
            LaySanPhamNoiBatAsync(
                int soLuong,
                CancellationToken cancellationToken)
        {
            soLuong = Math.Clamp(soLuong, 1, 20);

            var query = new SanPhamQueryDto
            {
                Trang = 1,
                KichThuocTrang = soLuong,
                NoiBat = true,
                SapXep = "moi-nhat"
            };

            var ketQua = await LayDanhSachCongKhaiAsync(
                query,
                cancellationToken
            );

            return ketQua.Items;
        }

        // =====================================================
        // 12. SAN PHAM MOI NHAT
        // =====================================================

        public async Task<List<SanPhamCongKhaiResponseDto>>
            LaySanPhamMoiNhatAsync(
                int soLuong,
                CancellationToken cancellationToken)
        {
            soLuong = Math.Clamp(soLuong, 1, 20);

            var query = new SanPhamQueryDto
            {
                Trang = 1,
                KichThuocTrang = soLuong,
                SapXep = "moi-nhat"
            };

            var ketQua = await LayDanhSachCongKhaiAsync(
                query,
                cancellationToken
            );

            return ketQua.Items;
        }
    }
}
