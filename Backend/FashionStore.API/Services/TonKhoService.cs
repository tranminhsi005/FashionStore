
using FashionStore.API.Data;
using FashionStore.API.DTOs.Common;
using FashionStore.API.DTOs.Inventory;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Services
{
    public class TonKhoService : ITonKhoService
    {
        private readonly AppDbContext _context;

        public TonKhoService(AppDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // 1. LAY DANH SACH TON KHO
        // =====================================================

        public async Task<PhanTrangResponseDto<TonKhoAdminResponseDto>>
            LayDanhSachAsync(
                string? tuKhoa,
                bool? conHang,
                int trang,
                int kichThuocTrang,
                CancellationToken cancellationToken)
        {
            KiemTraPhanTrang(trang, kichThuocTrang);

            var query = _context.BienTheSanPhams
                .AsNoTracking()
                .AsQueryable();

            // Tim theo ten san pham hoac SKU
            if (!string.IsNullOrWhiteSpace(tuKhoa))
            {
                string tuKhoaTimKiem = tuKhoa.Trim().ToLower();

                query = query.Where(x =>
                    x.Sku.ToLower().Contains(tuKhoaTimKiem) ||
                    x.SanPham.Ten.ToLower().Contains(tuKhoaTimKiem)
                );
            }

            // Loc bien the con hang / het hang
            if (conHang == true)
            {
                query = query.Where(x => x.SoLuongTon > 0);
            }
            else if (conHang == false)
            {
                query = query.Where(x => x.SoLuongTon == 0);
            }

            int tongSoBanGhi = await query.CountAsync(
                cancellationToken
            );

            long viTriBoQua = ((long)trang - 1) * kichThuocTrang;

            if (viTriBoQua > int.MaxValue)
            {
                throw new TonKhoServiceException(
                    "Số trang vượt quá giới hạn."
                );
            }

            var danhSach = await query
                // Hang het duoc hien thi truoc
                .OrderBy(x => x.SoLuongTon)
                .ThenBy(x => x.SanPham.Ten)
                .ThenBy(x => x.Sku)
                .Skip((int)viTriBoQua)
                .Take(kichThuocTrang)
                .Select(x => new TonKhoAdminResponseDto
                {
                    BienTheSanPhamId = x.Id,

                    SanPhamId = x.SanPhamId,

                    TenSanPham = x.SanPham.Ten,

                    Slug = x.SanPham.Slug,

                    Sku = x.Sku,

                    KichCoId = x.KichCoId,

                    TenKichCo = x.KichCo != null
                        ? x.KichCo.TenHienThi
                        : null,

                    MauSacId = x.MauSacId,

                    TenMauSac = x.MauSac != null
                        ? x.MauSac.Ten
                        : null,

                    MaHex = x.MauSac != null
                        ? x.MauSac.MaHex
                        : null,

                    SoLuongTon = x.SoLuongTon,

                    DangBan = x.DangBan,

                    NgayCapNhat = x.NgayCapNhat
                })
                .ToListAsync(cancellationToken);

            int tongSoTrang = (int)Math.Ceiling(
                tongSoBanGhi / (double)kichThuocTrang
            );

            return new PhanTrangResponseDto<TonKhoAdminResponseDto>
            {
                Items = danhSach,
                Trang = trang,
                KichThuocTrang = kichThuocTrang,
                TongSoBanGhi = tongSoBanGhi,
                TongSoTrang = tongSoTrang
            };
        }

        // =====================================================
        // 2. LAY CHI TIET TON KHO CUA BIEN THE
        // =====================================================

        public async Task<TonKhoAdminResponseDto?> LayChiTietAsync(
            Guid bienTheId,
            CancellationToken cancellationToken)
        {
            return await _context.BienTheSanPhams
                .AsNoTracking()
                .Where(x => x.Id == bienTheId)
                .Select(x => new TonKhoAdminResponseDto
                {
                    BienTheSanPhamId = x.Id,

                    SanPhamId = x.SanPhamId,

                    TenSanPham = x.SanPham.Ten,

                    Slug = x.SanPham.Slug,

                    Sku = x.Sku,

                    KichCoId = x.KichCoId,

                    TenKichCo = x.KichCo != null
                        ? x.KichCo.TenHienThi
                        : null,

                    MauSacId = x.MauSacId,

                    TenMauSac = x.MauSac != null
                        ? x.MauSac.Ten
                        : null,

                    MaHex = x.MauSac != null
                        ? x.MauSac.MaHex
                        : null,

                    SoLuongTon = x.SoLuongTon,

                    DangBan = x.DangBan,

                    NgayCapNhat = x.NgayCapNhat
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        // =====================================================
        // 3. LAY LICH SU TON KHO
        // =====================================================

        public async Task<PhanTrangResponseDto<LichSuTonKhoAdminResponseDto>>
            LayLichSuAsync(
                Guid bienTheId,
                int trang,
                int kichThuocTrang,
                CancellationToken cancellationToken)
        {
            KiemTraPhanTrang(trang, kichThuocTrang);

            bool bienTheTonTai = await _context.BienTheSanPhams
                .AnyAsync(
                    x => x.Id == bienTheId,
                    cancellationToken
                );

            if (!bienTheTonTai)
            {
                throw new TonKhoServiceException(
                    "Không tìm thấy biến thể sản phẩm.",
                    404
                );
            }

            var query = _context.LichSuTonKhos
                .AsNoTracking()
                .Where(x => x.BienTheSanPhamId == bienTheId);

            int tongSoBanGhi = await query.CountAsync(
                cancellationToken
            );

            long viTriBoQua = ((long)trang - 1) * kichThuocTrang;

            if (viTriBoQua > int.MaxValue)
            {
                throw new TonKhoServiceException(
                    "Số trang vượt quá giới hạn."
                );
            }

            var danhSach = await query
                .OrderByDescending(x => x.NgayTao)
                .ThenByDescending(x => x.Id)
                .Skip((int)viTriBoQua)
                .Take(kichThuocTrang)
                .Select(x => new LichSuTonKhoAdminResponseDto
                {
                    Id = x.Id,

                    BienTheSanPhamId = x.BienTheSanPhamId,

                    DonHangId = x.DonHangId,

                    TenSanPham = x.BienTheSanPham.SanPham.Ten,

                    Sku = x.BienTheSanPham.Sku,

                    SoLuongThayDoi = x.SoLuongThayDoi,

                    LoaiGiaoDich = x.LoaiGiaoDich,

                    GhiChu = x.GhiChu,

                    NguoiThucHienId = x.NguoiThucHienId,

                    TenNguoiThucHien = x.NguoiThucHien != null
                        ? x.NguoiThucHien.HoTen
                        : null,

                    NgayTao = x.NgayTao
                })
                .ToListAsync(cancellationToken);

            int tongSoTrang = (int)Math.Ceiling(
                tongSoBanGhi / (double)kichThuocTrang
            );

            return new PhanTrangResponseDto<LichSuTonKhoAdminResponseDto>
            {
                Items = danhSach,
                Trang = trang,
                KichThuocTrang = kichThuocTrang,
                TongSoBanGhi = tongSoBanGhi,
                TongSoTrang = tongSoTrang
            };
        }

        // =====================================================
        // 4. NHAP KHO
        // =====================================================

        public async Task<GiaoDichTonKhoResponseDto> NhapKhoAsync(
            Guid bienTheId,
            TaoGiaoDichKhoRequestDto request,
            Guid nguoiThucHienId,
            CancellationToken cancellationToken)
        {
            if (request.SoLuong <= 0)
            {
                throw new TonKhoServiceException(
                    "Số lượng nhập phải lớn hơn 0."
                );
            }

            string ghiChu = string.IsNullOrWhiteSpace(request.GhiChu)
                ? "Nhập kho thủ công."
                : request.GhiChu.Trim();

            return await ThucHienGiaoDichAsync(
                bienTheId,
                request.SoLuong,
                "nhap_hang",
                ghiChu,
                nguoiThucHienId,
                cancellationToken
            );
        }

        // =====================================================
        // 5. XUAT KHO
        // =====================================================

        public async Task<GiaoDichTonKhoResponseDto> XuatKhoAsync(
            Guid bienTheId,
            TaoGiaoDichKhoRequestDto request,
            Guid nguoiThucHienId,
            CancellationToken cancellationToken)
        {
            if (request.SoLuong <= 0)
            {
                throw new TonKhoServiceException(
                    "Số lượng xuất phải lớn hơn 0."
                );
            }

            string ghiChu = string.IsNullOrWhiteSpace(request.GhiChu)
                ? "Xuất kho thủ công."
                : request.GhiChu.Trim();

            return await ThucHienGiaoDichAsync(
                bienTheId,
                -request.SoLuong,
                "xuat_hang",
                ghiChu,
                nguoiThucHienId,
                cancellationToken
            );
        }

        // =====================================================
        // 6. DIEU CHINH TON KHO
        // =====================================================

        public async Task<GiaoDichTonKhoResponseDto> DieuChinhAsync(
            Guid bienTheId,
            DieuChinhTonKhoRequestDto request,
            Guid nguoiThucHienId,
            CancellationToken cancellationToken)
        {
            if (request.SoLuongMoi < 0)
            {
                throw new TonKhoServiceException(
                    "Số lượng tồn mới không được âm."
                );
            }

            if (string.IsNullOrWhiteSpace(request.GhiChu))
            {
                throw new TonKhoServiceException(
                    "Vui lòng nhập lý do điều chỉnh."
                );
            }

            // Khoa dong, doc ton kho hien tai va tinh chenh lech.
            return await ThucHienGiaoDichAsync(
                bienTheId,
                null,
                "dieu_chinh",
                request.GhiChu.Trim(),
                nguoiThucHienId,
                cancellationToken,
                request.SoLuongMoi
            );
        }

        // =====================================================
        // 7. HAM THUC HIEN GIAO DICH DUNG TRANSACTION
        // =====================================================

        private async Task<GiaoDichTonKhoResponseDto>
            ThucHienGiaoDichAsync(
                Guid bienTheId,
                int? soLuongThayDoi,
                string loaiGiaoDich,
                string ghiChu,
                Guid nguoiThucHienId,
                CancellationToken cancellationToken,
                int? soLuongMoi = null)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            // Khoa dong bien the trong PostgreSQL.
            // Giao dich khac phai doi cho den khi giao dich nay ket thuc.
            var danhSachKhoa = await _context.BienTheSanPhams
                .FromSqlInterpolated(
                    $@"SELECT *
                       FROM public.bien_the_san_pham
                       WHERE id = {bienTheId}
                       FOR UPDATE"
                )
                .ToListAsync(cancellationToken);

            var bienThe = danhSachKhoa.FirstOrDefault();

            if (bienThe == null)
            {
                throw new TonKhoServiceException(
                    "Không tìm thấy biến thể sản phẩm.",
                    404
                );
            }

            int soLuongTruoc = bienThe.SoLuongTon;

            // Dieu chinh theo so luong moi
            if (soLuongMoi.HasValue)
            {
                soLuongThayDoi = soLuongMoi.Value - soLuongTruoc;
            }

            if (!soLuongThayDoi.HasValue ||
                soLuongThayDoi.Value == 0)
            {
                throw new TonKhoServiceException(
                    "Số lượng tồn hiện tại đã bằng số lượng yêu cầu. Không có thay đổi để ghi nhận."
                );
            }

            long soLuongSauLong =
                (long)soLuongTruoc + soLuongThayDoi.Value;

            if (soLuongSauLong < 0)
            {
                throw new TonKhoServiceException(
                    $"Không đủ hàng trong kho. Hiện chỉ còn {soLuongTruoc} sản phẩm.",
                    409
                );
            }

            if (soLuongSauLong > int.MaxValue)
            {
                throw new TonKhoServiceException(
                    "Số lượng tồn vượt quá giới hạn cho phép.",
                    409
                );
            }

            int soLuongSau = (int)soLuongSauLong;

            DateTimeOffset hienTai = DateTimeOffset.UtcNow;

            // Cap nhat so luong ton
            bienThe.SoLuongTon = soLuongSau;

            bienThe.NgayCapNhat = hienTai;

            // Ghi lich su ton kho
            var lichSu = new LichSuTonKho
            {
                Id = Guid.NewGuid(),

                BienTheSanPhamId = bienThe.Id,

                DonHangId = null,

                NguoiThucHienId = nguoiThucHienId,

                SoLuongThayDoi = soLuongThayDoi.Value,

                LoaiGiaoDich = loaiGiaoDich,

                GhiChu = ghiChu,

                NgayTao = hienTai
            };

            _context.LichSuTonKhos.Add(lichSu);

            // Hai thay doi duoc luu trong cung transaction
            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            return new GiaoDichTonKhoResponseDto
            {
                BienTheSanPhamId = bienThe.Id,

                Sku = bienThe.Sku,

                SoLuongTruoc = soLuongTruoc,

                SoLuongThayDoi = soLuongThayDoi.Value,

                SoLuongSau = soLuongSau,

                LoaiGiaoDich = loaiGiaoDich,

                GhiChu = ghiChu,

                NgayTao = hienTai
            };
        }

        // =====================================================
        // 8. KIEM TRA PHAN TRANG
        // =====================================================

        private static void KiemTraPhanTrang(
            int trang,
            int kichThuocTrang)
        {
            if (trang < 1)
            {
                throw new TonKhoServiceException(
                    "Số trang phải lớn hơn hoặc bằng 1."
                );
            }

            if (kichThuocTrang < 1 || kichThuocTrang > 100)
            {
                throw new TonKhoServiceException(
                    "Kích thước trang phải từ 1 đến 100."
                );
            }
        }
    }
}
