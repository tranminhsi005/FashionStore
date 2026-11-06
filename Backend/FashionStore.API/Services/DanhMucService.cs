
using FashionStore.API.Data;
using FashionStore.API.DTOs.Categories;
using FashionStore.API.Helpers;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;

using Microsoft.EntityFrameworkCore;

using Npgsql;

namespace FashionStore.API.Services
{
    public class DanhMucService : IDanhMucService
    {
        private readonly AppDbContext _context;

        public DanhMucService(AppDbContext context)
        {
            _context = context;
        }

        // =============================================
        // LAY DANH SACH DANH MUC
        // =============================================

        public async Task<List<DanhMucResponseDto>> LayDanhSachAsync(
            bool baoGomNgungHoatDong,
            CancellationToken cancellationToken)
        {
            var query = _context.DanhMucs
                .AsNoTracking()
                .AsQueryable();

            if (!baoGomNgungHoatDong)
            {
                query = query.Where(x => x.DangHoatDong);
            }

            return await query
                .OrderBy(x => x.ThuTuHienThi)
                .ThenBy(x => x.Ten)
                .Select(x => new DanhMucResponseDto
                {
                    Id = x.Id,
                    DanhMucChaId = x.DanhMucChaId,
                    TenDanhMucCha = x.DanhMucCha != null
                        ? x.DanhMucCha.Ten
                        : string.Empty,
                    Ten = x.Ten,
                    Slug = x.Slug,
                    MoTa = x.MoTa,
                    ThuTuHienThi = x.ThuTuHienThi,
                    DangHoatDong = x.DangHoatDong,
                    NgayTao = x.NgayTao
                })
                .ToListAsync(cancellationToken);
        }

        // =============================================
        // LAY CHI TIET DANH MUC
        // =============================================

        public async Task<DanhMucChiTietResponseDto?> LayTheoSlugAsync(
            string slug,
            CancellationToken cancellationToken)
        {
            slug = slug.Trim().ToLowerInvariant();

            return await _context.DanhMucs
                .AsNoTracking()
                .Where(x =>
                    x.Slug == slug &&
                    x.DangHoatDong
                )
                .Select(x => new DanhMucChiTietResponseDto
                {
                    Id = x.Id,
                    DanhMucChaId = x.DanhMucChaId,
                    TenDanhMucCha = x.DanhMucCha != null
                        ? x.DanhMucCha.Ten
                        : string.Empty,
                    Ten = x.Ten,
                    Slug = x.Slug,
                    MoTa = x.MoTa,
                    ThuTuHienThi = x.ThuTuHienThi,
                    DangHoatDong = x.DangHoatDong,
                    NgayTao = x.NgayTao,
                    TongSoSanPham = x.SanPhams.Count(
                        p => p.TrangThai == "dang_ban"
                    )
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        // =============================================
        // TAO DANH MUC
        // =============================================

        public async Task<DanhMucResponseDto> TaoAsync(
            DanhMucRequestDto dto,
            CancellationToken cancellationToken)
        {
            string ten = dto.Ten.Trim();

            string slug = SlugHelper.TaoSlug(ten);

            if (string.IsNullOrWhiteSpace(slug))
            {
                throw new InvalidOperationException(
                    "Không thể tạo slug từ tên danh mục."
                );
            }

            await KiemTraDanhMucChaAsync(
                dto.DanhMucChaId,
                null,
                cancellationToken
            );

            var danhMuc = new DanhMuc
            {
                Id = Guid.NewGuid(),
                DanhMucChaId = dto.DanhMucChaId,
                Ten = ten,
                Slug = slug,
                MoTa = dto.MoTa?.Trim(),
                ThuTuHienThi = dto.ThuTuHienThi,
                DangHoatDong = true,
                NgayTao = DateTimeOffset.UtcNow,
                NgayCapNhat = DateTimeOffset.UtcNow
            };

            _context.DanhMucs.Add(danhMuc);

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
                when (ex.InnerException is PostgresException pg &&
                      pg.SqlState == PostgresErrorCodes.UniqueViolation)
            {
                throw new InvalidOperationException(
                    "Tên danh mục tạo ra slug đã tồn tại."
                );
            }

            return TaoResponse(danhMuc);
        }

        // =============================================
        // CAP NHAT DANH MUC
        // =============================================

        public async Task<DanhMucResponseDto?> CapNhatAsync(
            Guid id,
            DanhMucRequestDto dto,
            CancellationToken cancellationToken)
        {
            var danhMuc = await _context.DanhMucs
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (danhMuc == null)
            {
                return null;
            }

            await KiemTraDanhMucChaAsync(
                dto.DanhMucChaId,
                id,
                cancellationToken
            );

            string slug = SlugHelper.TaoSlug(dto.Ten.Trim());

            if (string.IsNullOrWhiteSpace(slug))
            {
                throw new InvalidOperationException(
                    "Không thể tạo slug từ tên danh mục."
                );
            }

            danhMuc.DanhMucChaId = dto.DanhMucChaId;
            danhMuc.Ten = dto.Ten.Trim();
            danhMuc.Slug = slug;
            danhMuc.MoTa = dto.MoTa?.Trim();
            danhMuc.ThuTuHienThi = dto.ThuTuHienThi;
            danhMuc.NgayCapNhat = DateTimeOffset.UtcNow;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
                when (ex.InnerException is PostgresException pg &&
                      pg.SqlState == PostgresErrorCodes.UniqueViolation)
            {
                throw new InvalidOperationException(
                    "Slug danh mục đã tồn tại."
                );
            }

            return TaoResponse(danhMuc);
        }

        // =============================================
        // NGUNG HOAT DONG
        // =============================================

        public async Task<bool> NgungHoatDongAsync(
            Guid id,
            CancellationToken cancellationToken)
        {
            var danhMuc = await _context.DanhMucs
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (danhMuc == null)
            {
                return false;
            }

            bool coSanPham = await _context.SanPhams
                .AnyAsync(
                    x => x.DanhMucId == id &&
                         x.TrangThai != "ngung_kinh_doanh",
                    cancellationToken
                );

            if (coSanPham)
            {
                throw new InvalidOperationException(
                    "Danh mục vẫn còn sản phẩm đang kinh doanh. Hãy chuyển sản phẩm sang danh mục khác trước."
                );
            }

            danhMuc.DangHoatDong = false;

            danhMuc.NgayCapNhat = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }

        // =============================================
        // KIEM TRA DANH MUC CHA
        // =============================================

        private async Task KiemTraDanhMucChaAsync(
            Guid? danhMucChaId,
            Guid? danhMucDangSuaId,
            CancellationToken cancellationToken)
        {
            if (!danhMucChaId.HasValue)
            {
                return;
            }

            if (danhMucDangSuaId.HasValue &&
                danhMucChaId.Value == danhMucDangSuaId.Value)
            {
                throw new InvalidOperationException(
                    "Danh mục không thể là cha của chính nó."
                );
            }

            var danhMucCha = await _context.DanhMucs
                .FirstOrDefaultAsync(
                    x => x.Id == danhMucChaId.Value &&
                         x.DangHoatDong,
                    cancellationToken
                );

            if (danhMucCha == null)
            {
                throw new InvalidOperationException(
                    "Danh mục cha không tồn tại hoặc đã ngừng hoạt động."
                );
            }

            // Khong cho tao chu trinh danh muc.
            if (danhMucDangSuaId.HasValue)
            {
                Guid? chaHienTai = danhMucCha.DanhMucChaId;

                while (chaHienTai.HasValue)
                {
                    if (chaHienTai.Value == danhMucDangSuaId.Value)
                    {
                        throw new InvalidOperationException(
                            "Không thể chọn danh mục con làm danh mục cha."
                        );
                    }

                    chaHienTai = await _context.DanhMucs
                        .Where(x => x.Id == chaHienTai.Value)
                        .Select(x => x.DanhMucChaId)
                        .FirstOrDefaultAsync(cancellationToken);
                }
            }
        }

        // =============================================
        // TAO RESPONSE DTO
        // =============================================

        private static DanhMucResponseDto TaoResponse(
            DanhMuc x)
        {
            return new DanhMucResponseDto
            {
                Id = x.Id,
                DanhMucChaId = x.DanhMucChaId,
                Ten = x.Ten,
                Slug = x.Slug,
                MoTa = x.MoTa,
                ThuTuHienThi = x.ThuTuHienThi,
                DangHoatDong = x.DangHoatDong,
                NgayTao = x.NgayTao
            };
        }
    }
}
