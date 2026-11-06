using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;


using FashionStore.API.Data;
using FashionStore.API.DTOs.Common;
using FashionStore.API.DTOs.Orders;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Services
{
    public class QuanTriDonHangService : IQuanTriDonHangService
    {
        private readonly AppDbContext _context;

        public QuanTriDonHangService(AppDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // 1. LAY DANH SACH DON HANG ADMIN
        // =====================================================

        public async Task<PhanTrangResponseDto<DonHangAdminDanhSachResponseDto>>
            LayDanhSachAsync(
                int trang,
                int kichThuocTrang,
                string? trangThai,
                string? tuKhoa,
                CancellationToken cancellationToken)
        {
            // Kiem tra tham so phan trang

            if (trang < 1)
            {
                throw new QuanTriDonHangServiceException(
                    400,
                    "Số trang phải lớn hơn hoặc bằng 1."
                );
            }

            if (kichThuocTrang < 1 || kichThuocTrang > 50)
            {
                throw new QuanTriDonHangServiceException(
                    400,
                    "Kích thước trang phải từ 1 đến 50."
                );
            }

            long soLuongBoQua =
                (long)(trang - 1) * kichThuocTrang;

            if (soLuongBoQua > int.MaxValue)
            {
                throw new QuanTriDonHangServiceException(
                    400,
                    "Số trang yêu cầu quá lớn."
                );
            }


            // Query tat ca don hang

            var query = _context.DonHangs
                .AsNoTracking()
                .AsQueryable();


            // Loc trang thai

            if (!string.IsNullOrWhiteSpace(trangThai))
            {
                trangThai = trangThai.Trim().ToLowerInvariant();

                string[] cacTrangThaiHopLe =
                {
                    "cho_xac_nhan",
                    "da_xac_nhan",
                    "dang_chuan_bi",
                    "dang_giao",
                    "da_giao",
                    "da_huy"
                };

                if (!cacTrangThaiHopLe.Contains(trangThai))
                {
                    throw new QuanTriDonHangServiceException(
                        400,
                        "Trạng thái đơn hàng không hợp lệ."
                    );
                }

                query = query.Where(
                    x => x.TrangThai == trangThai
                );
            }


            // Tim kiem ma don, ten, email, so dien thoai

            if (!string.IsNullOrWhiteSpace(tuKhoa))
            {
                string tuKhoaTimKiem =
                    tuKhoa.Trim().ToLowerInvariant();

                query = query.Where(x =>
                    x.MaDonHang.ToLower().Contains(tuKhoaTimKiem) ||

                    x.TenNguoiNhan.ToLower().Contains(tuKhoaTimKiem) ||

                    x.SoDienThoaiNhan.Contains(tuKhoaTimKiem) ||

                    x.NguoiDung.HoTen.ToLower().Contains(tuKhoaTimKiem) ||

                    x.NguoiDung.Email.ToLower().Contains(tuKhoaTimKiem)
                );
            }


            // Dem tong so don hang

            int tongSoBanGhi = await query.CountAsync(
                cancellationToken
            );


            // Lay danh sach don hang

            var danhSach = await query

                .OrderByDescending(x => x.NgayTao)

                .ThenByDescending(x => x.Id)

                .Skip((int)soLuongBoQua)

                .Take(kichThuocTrang)

                .Select(x => new DonHangAdminDanhSachResponseDto
                {
                    Id = x.Id,

                    MaDonHang = x.MaDonHang,

                    NguoiDungId = x.NguoiDungId,

                    TenKhachHang = x.NguoiDung.HoTen,

                    EmailKhachHang = x.NguoiDung.Email,

                    TrangThai = x.TrangThai,

                    TrangThaiThanhToan = x.TrangThaiThanhToan,

                    PhuongThucThanhToan = x.PhuongThucThanhToan,

                    TongThanhToan = x.TongThanhToan,

                    TenNguoiNhan = x.TenNguoiNhan,

                    SoDienThoaiNhan = x.SoDienThoaiNhan,

                    NgayTao = x.NgayTao
                })

                .ToListAsync(cancellationToken);


            int tongSoTrang = (int)Math.Ceiling(
                tongSoBanGhi / (double)kichThuocTrang
            );


            return new PhanTrangResponseDto<DonHangAdminDanhSachResponseDto>
            {
                Items = danhSach,

                Trang = trang,

                KichThuocTrang = kichThuocTrang,

                TongSoBanGhi = tongSoBanGhi,

                TongSoTrang = tongSoTrang
            };
        }


        // =====================================================
        // 2. LAY CHI TIET DON HANG ADMIN
        // =====================================================

        public async Task<DonHangAdminChiTietResponseDto?> LayChiTietAsync(
            Guid donHangId,
            CancellationToken cancellationToken)
        {
            var donHang = await _context.DonHangs
                .AsNoTracking()

                .Include(x => x.NguoiDung)

                .Include(x => x.ChiTietDonHangs)

                .Include(x => x.ThanhToans)

                .Include(x => x.VanChuyen)

                .Include(x => x.LichSuTrangThaiDonHangs)

                .AsSplitQuery()

                .FirstOrDefaultAsync(
                    x => x.Id == donHangId,
                    cancellationToken
                );


            if (donHang == null)
            {
                return null;
            }


            return TaoResponseChiTiet(donHang);
        }


        // =====================================================
        // 3. CAP NHAT TRANG THAI DON HANG
        // =====================================================

        public async Task<DonHangAdminChiTietResponseDto>
            CapNhatTrangThaiAsync(
                Guid adminId,
                Guid donHangId,
                CapNhatTrangThaiDonHangAdminRequestDto request,
                CancellationToken cancellationToken)
        {
            if (adminId == Guid.Empty)
            {
                throw new QuanTriDonHangServiceException(
                    401,
                    "Không xác định được tài khoản quản trị."
                );
            }

            if (request == null ||
                string.IsNullOrWhiteSpace(request.TrangThaiMoi))
            {
                throw new QuanTriDonHangServiceException(
                    400,
                    "Trạng thái đơn hàng không hợp lệ."
                );
            }

            string trangThaiMoi =
                request.TrangThaiMoi.Trim().ToLowerInvariant();


            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                // Khoa dong don hang

                var donHang = await KhoaDonHangAsync(
                    donHangId,
                    cancellationToken
                );


                string trangThaiCu = donHang.TrangThai;


                // Chi cho phep chuyen tung buoc

                bool chuyenTrangThaiHopLe = false;

                if (trangThaiCu == "cho_xac_nhan" &&
                    trangThaiMoi == "da_xac_nhan")
                {
                    chuyenTrangThaiHopLe = true;
                }
                else if (trangThaiCu == "da_xac_nhan" &&
                         trangThaiMoi == "dang_chuan_bi")
                {
                    chuyenTrangThaiHopLe = true;
                }


                if (!chuyenTrangThaiHopLe)
                {
                    throw new QuanTriDonHangServiceException(
                        409,
                        "Không thể chuyển đơn hàng từ trạng thái '" +
                        trangThaiCu +
                        "' sang '" +
                        trangThaiMoi +
                        "'."
                    );
                }


                DateTimeOffset hienTai = DateTimeOffset.UtcNow;


                // Cap nhat don hang

                donHang.TrangThai = trangThaiMoi;

                donHang.NgayCapNhat = hienTai;


                // Ghi lich su thay doi

                var lichSu = new LichSuTrangThaiDonHang
                {
                    Id = Guid.NewGuid(),

                    DonHangId = donHang.Id,

                    TrangThaiCu = trangThaiCu,

                    TrangThaiMoi = trangThaiMoi,

                    NguoiThucHienId = adminId,

                    GhiChu = string.IsNullOrWhiteSpace(request.GhiChu)
                        ? "Quản trị viên cập nhật trạng thái đơn hàng."
                        : request.GhiChu.Trim(),

                    NgayTao = hienTai
                };

                _context.LichSuTrangThaiDonHangs.Add(lichSu);


                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);


                // Lay lai chi tiet moi nhat

                var ketQua = await LayChiTietAsync(
                    donHangId,
                    cancellationToken
                );

                if (ketQua == null)
                {
                    throw new QuanTriDonHangServiceException(
                        500,
                        "Không thể đọc lại đơn hàng sau khi cập nhật."
                    );
                }

                return ketQua;
            }
            catch
            {
                await transaction.RollbackAsync(
                    CancellationToken.None
                );

                throw;
            }
        }


        // =====================================================
        // 4. CAP NHAT TRANG THAI VAN CHUYEN
        // =====================================================

        public async Task<DonHangAdminChiTietResponseDto>
            CapNhatVanChuyenAsync(
                Guid adminId,
                Guid donHangId,
                CapNhatVanChuyenAdminRequestDto request,
                CancellationToken cancellationToken)
        {
            if (adminId == Guid.Empty)
            {
                throw new QuanTriDonHangServiceException(
                    401,
                    "Không xác định được tài khoản quản trị."
                );
            }

            if (request == null ||
                string.IsNullOrWhiteSpace(request.TrangThaiMoi))
            {
                throw new QuanTriDonHangServiceException(
                    400,
                    "Trạng thái vận chuyển không hợp lệ."
                );
            }

            string trangThaiMoi =
                request.TrangThaiMoi.Trim().ToLowerInvariant();

            // Phase 9: Không xác nhận giao thành công tại API vận chuyển.
            // Phải dùng API xác nhận giao COD để cập nhật đồng thời
            // trạng thái đơn hàng, thanh toán và vận chuyển.
            if (trangThaiMoi == "da_giao")
            {
                throw new QuanTriDonHangServiceException(
                    409,
                    "Hãy sử dụng API xác nhận đã giao COD để đồng thời xác nhận đã thu tiền mặt."
                );
            }

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                // Khoa dong don hang de dong bo cac thao tac
                // cap nhat trang thai tren cung mot don.

                var donHang = await KhoaDonHangAsync(
                    donHangId,
                    cancellationToken
                );


                // Chi cho phep cap nhat van chuyen khi da chuan bi hang
                // hoac dang giao.

                if (donHang.TrangThai != "dang_chuan_bi" &&
                    donHang.TrangThai != "dang_giao")
                {
                    throw new QuanTriDonHangServiceException(
                        409,
                        "Đơn hàng chưa ở giai đoạn có thể cập nhật vận chuyển."
                    );
                }


                var vanChuyen = await _context.VanChuyens
                    .FirstOrDefaultAsync(
                        x => x.DonHangId == donHangId,
                        cancellationToken
                    );

                if (vanChuyen == null)
                {
                    throw new QuanTriDonHangServiceException(
                        409,
                        "Không tìm thấy thông tin vận chuyển của đơn hàng."
                    );
                }


                string trangThaiVanChuyenCu = vanChuyen.TrangThai;


                // -------------------------------------------------
                // KIEM TRA LUONG TRANG THAI VAN CHUYEN
                // -------------------------------------------------

                bool chuyenTrangThaiHopLe = false;

                if (trangThaiVanChuyenCu == "cho_xu_ly" &&
                    trangThaiMoi == "da_lay_hang" &&
                    donHang.TrangThai == "dang_chuan_bi")
                {
                    chuyenTrangThaiHopLe = true;
                }
                else if (trangThaiVanChuyenCu == "da_lay_hang" &&
                         trangThaiMoi == "dang_giao" &&
                         donHang.TrangThai == "dang_chuan_bi")
                {
                    chuyenTrangThaiHopLe = true;
                }
                else if (trangThaiVanChuyenCu == "da_lay_hang" &&
                         trangThaiMoi == "dang_giao" &&
                         donHang.TrangThai == "dang_giao")
                {
                    chuyenTrangThaiHopLe = true;
                }
                else if (trangThaiVanChuyenCu == "dang_giao" &&
                         trangThaiMoi == "giao_that_bai" &&
                         donHang.TrangThai == "dang_giao")
                {
                    chuyenTrangThaiHopLe = true;
                }
                else if (trangThaiVanChuyenCu == "giao_that_bai" &&
                         trangThaiMoi == "da_lay_hang" &&
                         donHang.TrangThai == "dang_giao")
                {
                    chuyenTrangThaiHopLe = true;
                }


                if (!chuyenTrangThaiHopLe)
                {
                    throw new QuanTriDonHangServiceException(
                        409,
                        "Không thể chuyển trạng thái vận chuyển từ '" +
                        trangThaiVanChuyenCu +
                        "' sang '" +
                        trangThaiMoi +
                        "'."
                    );
                }


                // -------------------------------------------------
                // CAP NHAT DON VI VAN CHUYEN VA MA VAN DON
                // -------------------------------------------------

                if (!string.IsNullOrWhiteSpace(request.DonViVanChuyen))
                {
                    vanChuyen.DonViVanChuyen =
                        request.DonViVanChuyen.Trim();
                }

                if (!string.IsNullOrWhiteSpace(request.MaVanDon))
                {
                    vanChuyen.MaVanDon =
                        request.MaVanDon.Trim();
                }


                // Khi bat dau giao hang, phai co don vi van chuyen
                // va ma van don.

                if (trangThaiMoi == "da_lay_hang")
                {
                    if (string.IsNullOrWhiteSpace(
                        vanChuyen.DonViVanChuyen) ||
                        string.IsNullOrWhiteSpace(
                        vanChuyen.MaVanDon))
                    {
                        throw new QuanTriDonHangServiceException(
                            400,
                            "Vui lòng nhập đơn vị vận chuyển và mã vận đơn trước khi bàn giao hàng."
                        );
                    }
                }


                DateTimeOffset hienTai = DateTimeOffset.UtcNow;


                // -------------------------------------------------
                // CAP NHAT TRANG THAI VAN CHUYEN
                // -------------------------------------------------

                vanChuyen.TrangThai = trangThaiMoi;

                vanChuyen.NgayCapNhat = hienTai;


                if (trangThaiMoi == "da_lay_hang")
                {
                    // Ngay ban giao cho don vi van chuyen.
                    // Khi giao lai, cap nhat lai thoi diem.

                    vanChuyen.ThoiDiemGuiHang = hienTai;
                }

                if (!string.IsNullOrWhiteSpace(request.GhiChu))
                {
                    vanChuyen.GhiChu = request.GhiChu.Trim();
                }


                // -------------------------------------------------
                // DONG BO TRANG THAI DON HANG
                // -------------------------------------------------

                string? trangThaiDonHangCu = null;

                string? trangThaiDonHangMoi = null;


                // Khi van chuyen bat dau giao:
                // dang_chuan_bi -> dang_giao

                if (trangThaiMoi == "dang_giao" &&
                    donHang.TrangThai == "dang_chuan_bi")
                {
                    trangThaiDonHangCu = donHang.TrangThai;

                    trangThaiDonHangMoi = "dang_giao";

                    donHang.TrangThai = trangThaiDonHangMoi;

                    donHang.NgayCapNhat = hienTai;
                }


                // Phase 9: Không chuyển đơn hàng sang da_giao ở API này.
                // Việc đó được thực hiện trong ThanhToanService khi admin
                // xác nhận khách đã nhận hàng và thanh toán COD.


                // -------------------------------------------------
                // GHI LICH SU DON HANG NEU TRANG THAI DON THAY DOI
                // -------------------------------------------------

                if (trangThaiDonHangMoi != null)
                {
                    var lichSu = new LichSuTrangThaiDonHang
                    {
                        Id = Guid.NewGuid(),

                        DonHangId = donHang.Id,

                        TrangThaiCu = trangThaiDonHangCu,

                        TrangThaiMoi = trangThaiDonHangMoi,

                        NguoiThucHienId = adminId,

                        GhiChu = string.IsNullOrWhiteSpace(request.GhiChu)
                            ? "Quản trị viên cập nhật trạng thái vận chuyển."
                            : request.GhiChu.Trim(),

                        NgayTao = hienTai
                    };

                    _context.LichSuTrangThaiDonHangs.Add(lichSu);
                }


                // -------------------------------------------------
                // LUU VA COMMIT
                // -------------------------------------------------

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);


                var ketQua = await LayChiTietAsync(
                    donHangId,
                    cancellationToken
                );

                if (ketQua == null)
                {
                    throw new QuanTriDonHangServiceException(
                        500,
                        "Không thể đọc lại đơn hàng sau khi cập nhật vận chuyển."
                    );
                }

                return ketQua;
            }
            catch
            {
                await transaction.RollbackAsync(
                    CancellationToken.None
                );

                throw;
            }
        }


        // =====================================================
        // 5. KHOA DONG DON HANG
        // =====================================================

        private async Task<DonHang> KhoaDonHangAsync(
            Guid donHangId,
            CancellationToken cancellationToken)
        {
            var danhSach = await _context.DonHangs
                .FromSqlInterpolated(
                    $"SELECT * FROM public.don_hang WHERE id = {donHangId} FOR UPDATE"
                )
                .ToListAsync(cancellationToken);

            var donHang = danhSach.FirstOrDefault();

            if (donHang == null)
            {
                throw new QuanTriDonHangServiceException(
                    404,
                    "Không tìm thấy đơn hàng."
                );
            }

            return donHang;
        }


        // =====================================================
        // 6. CHUYEN DOI CHI TIET DON HANG ADMIN
        // =====================================================

        private static DonHangAdminChiTietResponseDto TaoResponseChiTiet(
            DonHang donHang)
        {
            var thanhToan = donHang.ThanhToans
                .OrderByDescending(x => x.NgayTao)
                .FirstOrDefault();


            var vanChuyen = donHang.VanChuyen;


            return new DonHangAdminChiTietResponseDto
            {
                // Thong tin khach hang

                NguoiDungId = donHang.NguoiDungId,

                TenKhachHang = donHang.NguoiDung.HoTen,

                EmailKhachHang = donHang.NguoiDung.Email,


                // Thong tin don hang

                Id = donHang.Id,

                MaDonHang = donHang.MaDonHang,

                TrangThai = donHang.TrangThai,

                TrangThaiThanhToan = donHang.TrangThaiThanhToan,

                PhuongThucThanhToan = donHang.PhuongThucThanhToan,

                TongTienHang = donHang.TongTienHang,

                TienGiamGia = donHang.TienGiamGia,

                PhiVanChuyen = donHang.PhiVanChuyen,

                TongThanhToan = donHang.TongThanhToan,

                TienTe = donHang.TienTe,


                // Thong tin nguoi nhan

                TenNguoiNhan = donHang.TenNguoiNhan,

                SoDienThoaiNhan = donHang.SoDienThoaiNhan,

                TinhThanhNhan = donHang.TinhThanhNhan,

                QuanHuyenNhan = donHang.QuanHuyenNhan,

                PhuongXaNhan = donHang.PhuongXaNhan,

                DiaChiChiTietNhan = donHang.DiaChiChiTietNhan,

                GhiChuKhachHang = donHang.GhiChuKhachHang,


                // Thanh toan

                TrangThaiGiaoDichThanhToan =
                    thanhToan?.TrangThai,

                SoTienThanhToan =
                    thanhToan?.SoTien,


                // Van chuyen

                TrangThaiVanChuyen =
                    vanChuyen?.TrangThai,

                DonViVanChuyen =
                    vanChuyen?.DonViVanChuyen,

                MaVanDon =
                    vanChuyen?.MaVanDon,


                // Ngay tao

                NgayTao = donHang.NgayTao,


                // Chi tiet san pham

                ChiTietDonHangs = donHang.ChiTietDonHangs
                    .Select(x => new DonHangChiTietResponseDto
                    {
                        Id = x.Id,

                        SanPhamId = x.SanPhamId,

                        BienTheSanPhamId = x.BienTheSanPhamId,

                        TenSanPham = x.TenSanPham,

                        Sku = x.Sku,

                        TenKichCo = x.TenKichCo,

                        TenMauSac = x.TenMauSac,

                        SoLuong = x.SoLuong,

                        DonGia = x.DonGia,

                        TienGiamGia = x.TienGiamGia,

                        ThanhTien = x.ThanhTien
                    })
                    .ToList(),


                // Lich su trang thai

                LichSuTrangThai = donHang.LichSuTrangThaiDonHangs
                    .OrderBy(x => x.NgayTao)
                    .Select(x => new LichSuDonHangResponseDto
                    {
                        TrangThaiCu = x.TrangThaiCu,

                        TrangThaiMoi = x.TrangThaiMoi,

                        GhiChu = x.GhiChu,

                        NgayTao = x.NgayTao
                    })
                    .ToList()
            };
        }
    }
}
