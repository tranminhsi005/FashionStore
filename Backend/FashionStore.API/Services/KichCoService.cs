
using FashionStore.API.Data;
using FashionStore.API.DTOs.Catalog;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;

using Microsoft.EntityFrameworkCore;

using Npgsql;

namespace FashionStore.API.Services
{
    public class KichCoService : IKichCoService
    {
        private readonly AppDbContext _context;

        public KichCoService(AppDbContext context)
        {
            _context = context;
        }

        // =========================================
        // LAY DANH SACH KICH CO
        // =========================================

        public async Task<List<KichCoResponseDto>> LayDanhSachAsync(
            bool baoGomNgungHoatDong,
            CancellationToken cancellationToken)
        {
            var query = _context.KichCos
                .AsNoTracking()
                .AsQueryable();

            if (!baoGomNgungHoatDong)
            {
                query = query.Where(x => x.DangHoatDong);
            }

            return await query
                .OrderBy(x => x.ThuTuHienThi)
                .ThenBy(x => x.Ma)
                .Select(x => new KichCoResponseDto
                {
                    Id = x.Id,
                    Ma = x.Ma,
                    TenHienThi = x.TenHienThi,
                    ThuTuHienThi = x.ThuTuHienThi,
                    DangHoatDong = x.DangHoatDong
                })
                .ToListAsync(cancellationToken);
        }

        // =========================================
        // TAO KICH CO
        // =========================================

        public async Task<KichCoResponseDto> TaoAsync(
            KichCoRequestDto dto,
            CancellationToken cancellationToken)
        {
            string ma = dto.Ma.Trim().ToUpperInvariant();

            string ten = dto.TenHienThi.Trim();

            bool daTonTai = await _context.KichCos
                .AnyAsync(x => x.Ma == ma, cancellationToken);

            if (daTonTai)
            {
                throw new CatalogServiceException(
                    409,
                    "Mã kích cỡ đã tồn tại."
                );
            }

            var kichCo = new KichCo
            {
                Id = Guid.NewGuid(),
                Ma = ma,
                TenHienThi = ten,
                ThuTuHienThi = dto.ThuTuHienThi,
                DangHoatDong = true
            };

            _context.KichCos.Add(kichCo);

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
                    "Mã kích cỡ đã tồn tại."
                );
            }

            return TaoResponse(kichCo);
        }

        // =========================================
        // CAP NHAT KICH CO
        // =========================================

        public async Task<KichCoResponseDto?> CapNhatAsync(
            Guid id,
            KichCoRequestDto dto,
            CancellationToken cancellationToken)
        {
            var kichCo = await _context.KichCos
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (kichCo == null)
            {
                return null;
            }

            string ma = dto.Ma.Trim().ToUpperInvariant();

            string ten = dto.TenHienThi.Trim();

            bool maDaTonTai = await _context.KichCos
                .AnyAsync(
                    x => x.Id != id && x.Ma == ma,
                    cancellationToken
                );

            if (maDaTonTai)
            {
                throw new CatalogServiceException(
                    409,
                    "Mã kích cỡ đã được sử dụng."
                );
            }

            kichCo.Ma = ma;
            kichCo.TenHienThi = ten;
            kichCo.ThuTuHienThi = dto.ThuTuHienThi;

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
                    "Mã kích cỡ đã được sử dụng."
                );
            }

            return TaoResponse(kichCo);
        }

        // =========================================
        // NGUNG HOAT DONG
        // =========================================

        public async Task<bool> NgungHoatDongAsync(
            Guid id,
            CancellationToken cancellationToken)
        {
            var kichCo = await _context.KichCos
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (kichCo == null)
            {
                return false;
            }

            kichCo.DangHoatDong = false;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }

        // =========================================
        // TAO RESPONSE
        // =========================================

        private static KichCoResponseDto TaoResponse(KichCo x)
        {
            return new KichCoResponseDto
            {
                Id = x.Id,
                Ma = x.Ma,
                TenHienThi = x.TenHienThi,
                ThuTuHienThi = x.ThuTuHienThi,
                DangHoatDong = x.DangHoatDong
            };
        }
    }
}
