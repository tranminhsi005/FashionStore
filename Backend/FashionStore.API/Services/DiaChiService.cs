
using FashionStore.API.Data;
using FashionStore.API.DTOs.Addresses;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Services
{
    public class DiaChiService : IDiaChiService
    {
        private readonly AppDbContext _context;

        public DiaChiService(AppDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // 1. LAY DANH SACH DIA CHI
        // =====================================================

        public async Task<List<DiaChiGiaoHangResponseDto>>
            LayDanhSachAsync(
                Guid nguoiDungId,
                CancellationToken cancellationToken)
        {
            return await _context.DiaChiGiaoHangs
                .AsNoTracking()
                .Where(x => x.NguoiDungId == nguoiDungId)
                .OrderByDescending(x => x.LaMacDinh)
                .ThenByDescending(x => x.NgayCapNhat)
                .Select(x => ChuyenDoiDto(x))
                .ToListAsync(cancellationToken);
        }

        // =====================================================
        // 2. TAO DIA CHI
        // =====================================================

        public async Task<DiaChiGiaoHangResponseDto> TaoAsync(
            Guid nguoiDungId,
            DiaChiGiaoHangRequestDto request,
            CancellationToken cancellationToken)
        {
            KiemTraDuLieu(request);

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                // Khoa dong nguoi dung de tranh hai request
                // cung thay doi dia chi mac dinh dong thoi.
                await KhoaNguoiDungAsync(
                    nguoiDungId,
                    cancellationToken
                );

                var danhSachCu = await _context.DiaChiGiaoHangs
                    .Where(x => x.NguoiDungId == nguoiDungId)
                    .ToListAsync(cancellationToken);

                // Dia chi dau tien tu dong la mac dinh.
                bool laMacDinh =
                    request.LaMacDinh || danhSachCu.Count == 0;

                if (laMacDinh)
                {
                    // Bo mac dinh cua cac dia chi cu truoc.
                    foreach (var diaChiCu in danhSachCu)
                    {
                        diaChiCu.LaMacDinh = false;
                    }

                    // Luu truoc de giai phong unique index.
                    await _context.SaveChangesAsync(cancellationToken);
                }

                DateTimeOffset hienTai = DateTimeOffset.UtcNow;

                var diaChi = new DiaChiGiaoHang
                {
                    Id = Guid.NewGuid(),

                    NguoiDungId = nguoiDungId,

                    TenNguoiNhan = request.TenNguoiNhan.Trim(),

                    SoDienThoai = request.SoDienThoai.Trim(),

                    TinhThanh = request.TinhThanh.Trim(),

                    QuanHuyen = request.QuanHuyen?.Trim(),

                    PhuongXa = request.PhuongXa.Trim(),

                    DiaChiChiTiet = request.DiaChiChiTiet.Trim(),

                    LaMacDinh = laMacDinh,

                    NgayTao = hienTai,

                    NgayCapNhat = hienTai
                };

                _context.DiaChiGiaoHangs.Add(diaChi);

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return ChuyenDoiDto(diaChi);
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 3. CAP NHAT DIA CHI
        // =====================================================

        public async Task<DiaChiGiaoHangResponseDto?>
            CapNhatAsync(
                Guid nguoiDungId,
                Guid diaChiId,
                DiaChiGiaoHangRequestDto request,
                CancellationToken cancellationToken)
        {
            KiemTraDuLieu(request);

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                await KhoaNguoiDungAsync(
                    nguoiDungId,
                    cancellationToken
                );

                // Chi tim dia chi thuoc nguoi dung dang dang nhap.
                var diaChi = await _context.DiaChiGiaoHangs
                    .FirstOrDefaultAsync(
                        x =>
                            x.Id == diaChiId &&
                            x.NguoiDungId == nguoiDungId,
                        cancellationToken
                    );

                if (diaChi == null)
                {
                    return null;
                }

                // Neu muon dat dia chi nay lam mac dinh,
                // bo mac dinh cua cac dia chi khac truoc.
                if (request.LaMacDinh)
                {
                    var danhSachCu = await _context.DiaChiGiaoHangs
                        .Where(x =>
                            x.NguoiDungId == nguoiDungId &&
                            x.Id != diaChiId
                        )
                        .ToListAsync(cancellationToken);

                    foreach (var item in danhSachCu)
                    {
                        item.LaMacDinh = false;
                    }

                    // Luu truoc de tranh xung dot unique index.
                    await _context.SaveChangesAsync(cancellationToken);
                }

                diaChi.TenNguoiNhan =
                    request.TenNguoiNhan.Trim();

                diaChi.SoDienThoai =
                    request.SoDienThoai.Trim();

                diaChi.TinhThanh =
                    request.TinhThanh.Trim();

                diaChi.QuanHuyen =
                    request.QuanHuyen?.Trim();

                diaChi.PhuongXa =
                    request.PhuongXa.Trim();

                diaChi.DiaChiChiTiet =
                    request.DiaChiChiTiet.Trim();

                diaChi.LaMacDinh = request.LaMacDinh;

                diaChi.NgayCapNhat = DateTimeOffset.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return ChuyenDoiDto(diaChi);
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 4. DAT DIA CHI MAC DINH
        // =====================================================

        public async Task<bool> DatMacDinhAsync(
            Guid nguoiDungId,
            Guid diaChiId,
            CancellationToken cancellationToken)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                await KhoaNguoiDungAsync(
                    nguoiDungId,
                    cancellationToken
                );

                var danhSach = await _context.DiaChiGiaoHangs
                    .Where(x => x.NguoiDungId == nguoiDungId)
                    .ToListAsync(cancellationToken);

                var diaChi = danhSach.FirstOrDefault(
                    x => x.Id == diaChiId
                );

                if (diaChi == null)
                {
                    return false;
                }

                DateTimeOffset hienTai = DateTimeOffset.UtcNow;

                // Buoc 1: Bo mac dinh cua cac dia chi khac.
                foreach (var item in danhSach)
                {
                    if (item.Id != diaChiId)
                    {
                        item.LaMacDinh = false;
                        item.NgayCapNhat = hienTai;
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);

                // Buoc 2: Dat dia chi duoc chon lam mac dinh.
                diaChi.LaMacDinh = true;
                diaChi.NgayCapNhat = hienTai;

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return true;
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 5. XOA DIA CHI
        // =====================================================

        public async Task<bool> XoaAsync(
            Guid nguoiDungId,
            Guid diaChiId,
            CancellationToken cancellationToken)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                await KhoaNguoiDungAsync(
                    nguoiDungId,
                    cancellationToken
                );

                var danhSach = await _context.DiaChiGiaoHangs
                    .Where(x => x.NguoiDungId == nguoiDungId)
                    .ToListAsync(cancellationToken);

                var diaChi = danhSach.FirstOrDefault(
                    x => x.Id == diaChiId
                );

                if (diaChi == null)
                {
                    return false;
                }

                bool laMacDinh = diaChi.LaMacDinh;

                // Xoa dia chi hien tai truoc.
                _context.DiaChiGiaoHangs.Remove(diaChi);

                // Luu truoc de xoa ban ghi khoi unique index.
                await _context.SaveChangesAsync(cancellationToken);

                // Neu xoa dia chi mac dinh,
                // chon mot dia chi khac lam mac dinh.
                if (laMacDinh)
                {
                    var diaChiThayThe = danhSach
                        .Where(x => x.Id != diaChiId)
                        .OrderByDescending(x => x.NgayCapNhat)
                        .ThenByDescending(x => x.NgayTao)
                        .FirstOrDefault();

                    if (diaChiThayThe != null)
                    {
                        diaChiThayThe.LaMacDinh = true;

                        diaChiThayThe.NgayCapNhat =
                            DateTimeOffset.UtcNow;

                        await _context.SaveChangesAsync(
                            cancellationToken
                        );
                    }
                }

                await transaction.CommitAsync(cancellationToken);

                return true;
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        // =====================================================
        // 6. KHOA DONG NGUOI DUNG
        // =====================================================

        private async Task KhoaNguoiDungAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken)
        {
            // FOR UPDATE giu khoa dong nguoi dung
            // cho den khi transaction hien tai ket thuc.
            var danhSach = await _context.NguoiDungs
                .FromSqlInterpolated(
                    $@"SELECT *
                       FROM public.nguoi_dung
                       WHERE id = {nguoiDungId}
                       FOR UPDATE"
                )
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            if (danhSach.Count == 0 ||
                !danhSach[0].DangHoatDong)
            {
                throw new DiaChiServiceException(
                    "Tài khoản không tồn tại hoặc đã bị khóa.",
                    401
                );
            }
        }

        // =====================================================
        // 7. KIEM TRA DU LIEU
        // =====================================================

        private static void KiemTraDuLieu(
            DiaChiGiaoHangRequestDto request)
        {
            if (request == null)
            {
                throw new DiaChiServiceException(
                    "Dữ liệu địa chỉ không hợp lệ."
                );
            }

            if (string.IsNullOrWhiteSpace(request.TenNguoiNhan))
            {
                throw new DiaChiServiceException(
                    "Tên người nhận không được để trống."
                );
            }

            if (string.IsNullOrWhiteSpace(request.SoDienThoai))
            {
                throw new DiaChiServiceException(
                    "Số điện thoại không được để trống."
                );
            }

            if (string.IsNullOrWhiteSpace(request.TinhThanh))
            {
                throw new DiaChiServiceException(
                    "Tỉnh/thành không được để trống."
                );
            }

            if (string.IsNullOrWhiteSpace(request.PhuongXa))
            {
                throw new DiaChiServiceException(
                    "Phường/xã không được để trống."
                );
            }

            if (string.IsNullOrWhiteSpace(request.DiaChiChiTiet))
            {
                throw new DiaChiServiceException(
                    "Địa chỉ chi tiết không được để trống."
                );
            }
        }

        // =====================================================
        // 8. CHUYEN DOI ENTITY SANG DTO
        // =====================================================

        private static DiaChiGiaoHangResponseDto ChuyenDoiDto(
            DiaChiGiaoHang x)
        {
            return new DiaChiGiaoHangResponseDto
            {
                Id = x.Id,

                TenNguoiNhan = x.TenNguoiNhan,

                SoDienThoai = x.SoDienThoai,

                TinhThanh = x.TinhThanh,

                QuanHuyen = x.QuanHuyen,

                PhuongXa = x.PhuongXa,

                DiaChiChiTiet = x.DiaChiChiTiet,

                LaMacDinh = x.LaMacDinh,

                NgayTao = x.NgayTao,

                NgayCapNhat = x.NgayCapNhat
            };
        }
    }
}
