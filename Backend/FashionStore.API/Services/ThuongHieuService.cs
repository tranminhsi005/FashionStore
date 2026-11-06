
using FashionStore.API.Data;
using FashionStore.API.DTOs.Catalog;
using FashionStore.API.Helpers;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;

using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace FashionStore.API.Services
{
    public class ThuongHieuService : IThuongHieuService
    {
        private readonly AppDbContext _context;

        public ThuongHieuService(AppDbContext context)
        {
            _context = context;
        }

        // =========================================
        // LAY DANH SACH
        // =========================================

        public async Task<List<ThuongHieuResponseDto>> LayDanhSachAsync(
            bool baoGomNgungHoatDong,
            CancellationToken cancellationToken)
        {
            var query = _context.ThuongHieus
                .AsNoTracking()
                .AsQueryable();

            if (!baoGomNgungHoatDong)
            {
                query = query.Where(x => x.DangHoatDong);
            }

            return await query
                .OrderBy(x => x.Ten)
                .Select(x => new ThuongHieuResponseDto
                {
                    Id = x.Id,
                    Ten = x.Ten,
                    Slug = x.Slug,
                    MoTa = x.MoTa,
                    DuongDanLogo = x.DuongDanLogo,
                    DangHoatDong = x.DangHoatDong,
                    NgayTao = x.NgayTao
                })
                .ToListAsync(cancellationToken);
        }

        // =========================================
        // LAY THEO SLUG
        // =========================================

        public async Task<ThuongHieuResponseDto?> LayTheoSlugAsync(
            string slug,
            CancellationToken cancellationToken)
        {
            slug = slug.Trim().ToLowerInvariant();

            return await _context.ThuongHieus
                .AsNoTracking()
                .Where(x =>
                    x.Slug == slug &&
                    x.DangHoatDong
                )
                .Select(x => new ThuongHieuResponseDto
                {
                    Id = x.Id,
                    Ten = x.Ten,
                    Slug = x.Slug,
                    MoTa = x.MoTa,
                    DuongDanLogo = x.DuongDanLogo,
                    DangHoatDong = x.DangHoatDong,
                    NgayTao = x.NgayTao
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        // =========================================
        // TAO THUONG HIEU
        // =========================================

        public async Task<ThuongHieuResponseDto> TaoAsync(
            ThuongHieuRequestDto dto,
            CancellationToken cancellationToken)
        {
            string ten = dto.Ten.Trim();

            string slug = SlugHelper.TaoSlug(ten);

            if (string.IsNullOrWhiteSpace(slug))
            {
                throw new CatalogServiceException(
                    400,
                    "Tên thương hiệu không hợp lệ."
                );
            }

            bool slugDaTonTai = await _context.ThuongHieus
                .AnyAsync(x => x.Slug == slug, cancellationToken);

            if (slugDaTonTai)
            {
                throw new CatalogServiceException(
                    409,
                    "Slug thương hiệu đã tồn tại."
                );
            }

            DateTimeOffset hienTai = DateTimeOffset.UtcNow;

            var thuongHieu = new ThuongHieu
            {
                Id = Guid.NewGuid(),
                Ten = ten,
                Slug = slug,
                MoTa = dto.MoTa?.Trim(),
                DuongDanLogo = null,
                DangHoatDong = true,
                NgayTao = hienTai,
                NgayCapNhat = hienTai
            };

            _context.ThuongHieus.Add(thuongHieu);

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
                    "Slug thương hiệu đã tồn tại."
                );
            }

            return TaoResponse(thuongHieu);
        }

        // =========================================
        // CAP NHAT
        // =========================================

        public async Task<ThuongHieuResponseDto?> CapNhatAsync(
            Guid id,
            ThuongHieuRequestDto dto,
            CancellationToken cancellationToken)
        {
            var thuongHieu = await _context.ThuongHieus
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (thuongHieu == null)
            {
                return null;
            }

            string ten = dto.Ten.Trim();

            string slug = SlugHelper.TaoSlug(ten);

            bool slugDaTonTai = await _context.ThuongHieus
                .AnyAsync(
                    x => x.Id != id && x.Slug == slug,
                    cancellationToken
                );

            if (slugDaTonTai)
            {
                throw new CatalogServiceException(
                    409,
                    "Slug thương hiệu đã tồn tại."
                );
            }

            thuongHieu.Ten = ten;
            thuongHieu.Slug = slug;
            thuongHieu.MoTa = dto.MoTa?.Trim();
            thuongHieu.NgayCapNhat = DateTimeOffset.UtcNow;

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
                    "Slug thương hiệu đã tồn tại."
                );
            }

            return TaoResponse(thuongHieu);
        }

        // =========================================
        // NGUNG HOAT DONG
        // =========================================

        public async Task<bool> NgungHoatDongAsync(
            Guid id,
            CancellationToken cancellationToken)
        {
            var thuongHieu = await _context.ThuongHieus
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (thuongHieu == null)
            {
                return false;
            }

            thuongHieu.DangHoatDong = false;
            thuongHieu.NgayCapNhat = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }

        // =========================================
        // TAO RESPONSE
        // =========================================

        private static ThuongHieuResponseDto TaoResponse(
            ThuongHieu x)
        {
            return new ThuongHieuResponseDto
            {
                Id = x.Id,
                Ten = x.Ten,
                Slug = x.Slug,
                MoTa = x.MoTa,
                DuongDanLogo = x.DuongDanLogo,
                DangHoatDong = x.DangHoatDong,
                NgayTao = x.NgayTao
            };
        }
    }
}
