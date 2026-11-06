
using System.Text.RegularExpressions;

using FashionStore.API.Data;
using FashionStore.API.DTOs.Catalog;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;

using Microsoft.EntityFrameworkCore;

using Npgsql;

namespace FashionStore.API.Services
{
    public class MauSacService : IMauSacService
    {
        private readonly AppDbContext _context;

        public MauSacService(AppDbContext context)
        {
            _context = context;
        }

        // =========================================
        // LAY DANH SACH MAU SAC
        // =========================================

        public async Task<List<MauSacResponseDto>> LayDanhSachAsync(
            bool baoGomNgungHoatDong,
            CancellationToken cancellationToken)
        {
            var query = _context.MauSacs
                .AsNoTracking()
                .AsQueryable();

            if (!baoGomNgungHoatDong)
            {
                query = query.Where(x => x.DangHoatDong);
            }

            return await query
                .OrderBy(x => x.ThuTuHienThi)
                .ThenBy(x => x.Ten)
                .Select(x => new MauSacResponseDto
                {
                    Id = x.Id,
                    Ten = x.Ten,
                    MaHex = x.MaHex,
                    ThuTuHienThi = x.ThuTuHienThi,
                    DangHoatDong = x.DangHoatDong
                })
                .ToListAsync(cancellationToken);
        }

        // =========================================
        // TAO MAU SAC
        // =========================================

        public async Task<MauSacResponseDto> TaoAsync(
            MauSacRequestDto dto,
            CancellationToken cancellationToken)
        {
            string ten = dto.Ten.Trim();

            string? maHex = ChuanHoaMaHex(dto.MaHex);

            bool daTonTai = await _context.MauSacs
                .AnyAsync(
                    x => x.Ten.ToLower() == ten.ToLower(),
                    cancellationToken
                );

            if (daTonTai)
            {
                throw new CatalogServiceException(
                    409,
                    "Tên màu sắc đã tồn tại."
                );
            }

            var mauSac = new MauSac
            {
                Id = Guid.NewGuid(),
                Ten = ten,
                MaHex = maHex,
                ThuTuHienThi = dto.ThuTuHienThi,
                DangHoatDong = true
            };

            _context.MauSacs.Add(mauSac);

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
                    "Tên màu sắc đã tồn tại."
                );
            }

            return TaoResponse(mauSac);
        }

        // =========================================
        // CAP NHAT MAU SAC
        // =========================================

        public async Task<MauSacResponseDto?> CapNhatAsync(
            Guid id,
            MauSacRequestDto dto,
            CancellationToken cancellationToken)
        {
            var mauSac = await _context.MauSacs
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (mauSac == null)
            {
                return null;
            }

            string ten = dto.Ten.Trim();

            string? maHex = ChuanHoaMaHex(dto.MaHex);

            bool tenDaTonTai = await _context.MauSacs
                .AnyAsync(
                    x => x.Id != id &&
                         x.Ten.ToLower() == ten.ToLower(),
                    cancellationToken
                );

            if (tenDaTonTai)
            {
                throw new CatalogServiceException(
                    409,
                    "Tên màu sắc đã được sử dụng."
                );
            }

            mauSac.Ten = ten;
            mauSac.MaHex = maHex;
            mauSac.ThuTuHienThi = dto.ThuTuHienThi;

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
                    "Tên màu sắc đã được sử dụng."
                );
            }

            return TaoResponse(mauSac);
        }

        // =========================================
        // NGUNG HOAT DONG
        // =========================================

        public async Task<bool> NgungHoatDongAsync(
            Guid id,
            CancellationToken cancellationToken)
        {
            var mauSac = await _context.MauSacs
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken
                );

            if (mauSac == null)
            {
                return false;
            }

            mauSac.DangHoatDong = false;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }

        // =========================================
        // CHUAN HOA MA HEX
        // =========================================

        private static string? ChuanHoaMaHex(string? maHex)
        {
            if (string.IsNullOrWhiteSpace(maHex))
            {
                return null;
            }

            maHex = maHex.Trim().ToUpperInvariant();

            if (!Regex.IsMatch(
                maHex,
                @"^#[0-9A-F]{6}$"))
            {
                throw new CatalogServiceException(
                    400,
                    "Mã HEX phải có định dạng #RRGGBB."
                );
            }

            return maHex;
        }

        // =========================================
        // TAO RESPONSE
        // =========================================

        private static MauSacResponseDto TaoResponse(MauSac x)
        {
            return new MauSacResponseDto
            {
                Id = x.Id,
                Ten = x.Ten,
                MaHex = x.MaHex,
                ThuTuHienThi = x.ThuTuHienThi,
                DangHoatDong = x.DangHoatDong
            };
        }
    }
}
