
using FashionStore.API.Data;
using FashionStore.API.DTOs.Common;
using FashionStore.API.DTOs.Orders;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Services
{
    public class DonHangService : IDonHangService
    {
        private readonly AppDbContext _context;

        public DonHangService(AppDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // 3. LAY CHI TIET DON HANG CUA TOI
        // =====================================================

        public async Task<DonHangResponseDto?> LayChiTietCuaToiAsync(
            Guid nguoiDungId,
            Guid donHangId,
            CancellationToken cancellationToken)
        {
            var donHang = await _context.DonHangs
                .AsNoTracking()

                // Chi tiết sản phẩm trong đơn hàng
                .Include(x => x.ChiTietDonHangs)

                // Thông tin thanh toán
                .Include(x => x.ThanhToans)

                // Thông tin vận chuyển
                .Include(x => x.VanChuyen)

                // Lịch sử trạng thái đơn hàng
                .Include(x => x.LichSuTrangThaiDonHangs)

                .AsSplitQuery()

                // Điều kiện quan trọng:
                // Đơn hàng phải thuộc đúng người dùng đang đăng nhập.
                .FirstOrDefaultAsync(
                    x =>
                        x.Id == donHangId &&
                        x.NguoiDungId == nguoiDungId,
                    cancellationToken
                );


            if (donHang == null)
            {
                return null;
            }


            // -------------------------------------------------
            // CHUYEN DOI THONG TIN DON HANG
            // -------------------------------------------------

            var ketQua = ChuyenDoiDto(
                donHang,
                donHang.ChiTietDonHangs
            );


            // -------------------------------------------------
            // THONG TIN THANH TOAN
            // -------------------------------------------------

            var thanhToan = donHang.ThanhToans
                .OrderByDescending(x => x.NgayTao)
                .FirstOrDefault();

            if (thanhToan != null)
            {
                ketQua.TrangThaiGiaoDichThanhToan =
                    thanhToan.TrangThai;

                ketQua.SoTienThanhToan =
                    thanhToan.SoTien;
            }


            // -------------------------------------------------
            // THONG TIN VAN CHUYEN
            // -------------------------------------------------

            if (donHang.VanChuyen != null)
            {
                ketQua.TrangThaiVanChuyen =
                    donHang.VanChuyen.TrangThai;

                ketQua.DonViVanChuyen =
                    donHang.VanChuyen.DonViVanChuyen;

                ketQua.MaVanDon =
                    donHang.VanChuyen.MaVanDon;
            }


            // -------------------------------------------------
            // LICH SU TRANG THAI
            // -------------------------------------------------

            ketQua.LichSuTrangThai = donHang.LichSuTrangThaiDonHangs

                .OrderBy(x => x.NgayTao)

                .Select(x => new LichSuDonHangResponseDto
                {
                    TrangThaiCu = x.TrangThaiCu,

                    TrangThaiMoi = x.TrangThaiMoi,

                    GhiChu = x.GhiChu,

                    NgayTao = x.NgayTao
                })

                .ToList();


            return ketQua;
        }


        // =====================================================
        // 1. TAO DON HANG
        // =====================================================

        public async Task<DonHangResponseDto> TaoDonHangAsync(
            Guid nguoiDungId,
            TaoDonHangRequestDto request,
            CancellationToken cancellationToken)
        {
            KiemTraRequest(request);

            string phuongThucThanhToan =
                request.PhuongThucThanhToan.Trim().ToLowerInvariant();

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                // -------------------------------------------------
                // BUOC 1: KHOA NGUOI DUNG
                // -------------------------------------------------

                await KhoaNguoiDungAsync(
                    nguoiDungId,
                    cancellationToken
                );


                // -------------------------------------------------
                // BUOC 2: KIEM TRA IDEMPOTENCY
                // -------------------------------------------------

                var donHangDaTonTai = await _context.DonHangs
                    .AsNoTracking()
                    .Include(x => x.ChiTietDonHangs)
                    .FirstOrDefaultAsync(
                        x =>
                            x.NguoiDungId == nguoiDungId &&
                            x.KhoaIdempotent == request.KhoaIdempotent,
                        cancellationToken
                    );

                if (donHangDaTonTai != null)
                {
                    await transaction.CommitAsync(cancellationToken);

                    return ChuyenDoiDto(
                        donHangDaTonTai,
                        donHangDaTonTai.ChiTietDonHangs
                    );
                }


                // -------------------------------------------------
                // BUOC 3: KIEM TRA DIA CHI GIAO HANG
                // -------------------------------------------------

                var diaChi = await _context.DiaChiGiaoHangs
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        x =>
                            x.Id == request.DiaChiGiaoHangId &&
                            x.NguoiDungId == nguoiDungId,
                        cancellationToken
                    );

                if (diaChi == null)
                {
                    throw new DonHangServiceException(
                        404,
                        "Địa chỉ giao hàng không tồn tại hoặc không thuộc tài khoản của bạn."
                    );
                }


                // -------------------------------------------------
                // BUOC 4: KIEM TRA GIO HANG
                // -------------------------------------------------

                var gioHang = await _context.GioHangs
                    .FirstOrDefaultAsync(
                        x => x.NguoiDungId == nguoiDungId,
                        cancellationToken
                    );

                if (gioHang == null)
                {
                    throw new DonHangServiceException(
                        400,
                        "Giỏ hàng của bạn đang trống."
                    );
                }


                // Lấy danh sách ID biến thể trong giỏ hàng.
                // Chưa Include biến thể ở bước này vì cần khóa
                // các dòng tồn kho trước khi đọc giá và số lượng.

                var danhSachBienTheId = await _context.GioHangChiTiets
                    .AsNoTracking()
                    .Where(x => x.GioHangId == gioHang.Id)
                    .Select(x => x.BienTheSanPhamId)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(cancellationToken);

                if (danhSachBienTheId.Count == 0)
                {
                    throw new DonHangServiceException(
                        400,
                        "Giỏ hàng của bạn đang trống."
                    );
                }


                // -------------------------------------------------
                // BUOC 5: KHOA CAC BIEN THE SAN PHAM
                // -------------------------------------------------

                // Khóa theo thứ tự Guid tăng dần để giảm nguy cơ
                // deadlock khi nhiều khách cùng đặt các sản phẩm.

                foreach (Guid bienTheId in danhSachBienTheId)
                {
                    await KhoaBienTheAsync(
                        bienTheId,
                        cancellationToken
                    );
                }


                // -------------------------------------------------
                // BUOC 6: DOC LAI CHI TIET GIO HANG
                // -------------------------------------------------

                var danhSachDongGioHang =
                    await _context.GioHangChiTiets
                        .Where(x => x.GioHangId == gioHang.Id)

                        .Include(x => x.BienTheSanPham)
                            .ThenInclude(x => x.SanPham)

                        .Include(x => x.BienTheSanPham)
                            .ThenInclude(x => x.KichCo)

                        .Include(x => x.BienTheSanPham)
                            .ThenInclude(x => x.MauSac)

                        .ToListAsync(cancellationToken);

                if (danhSachDongGioHang.Count == 0)
                {
                    throw new DonHangServiceException(
                        400,
                        "Giỏ hàng của bạn đang trống."
                    );
                }


                // -------------------------------------------------
                // BUOC 7: KIEM TRA SAN PHAM VA TON KHO
                // -------------------------------------------------

                decimal tongTienHang = 0m;

                var danhSachChiTietDonHang =
                    new List<ChiTietDonHang>();

                foreach (var dongGioHang in danhSachDongGioHang)
                {
                    var bienThe = dongGioHang.BienTheSanPham;

                    if (bienThe == null)
                    {
                        throw new DonHangServiceException(
                            409,
                            "Một sản phẩm trong giỏ hàng không còn tồn tại."
                        );
                    }

                    if (bienThe.SanPham == null)
                    {
                        throw new DonHangServiceException(
                            409,
                            "Thông tin sản phẩm không còn tồn tại."
                        );
                    }

                    if (!bienThe.DangBan ||
                        bienThe.SanPham.TrangThai != "dang_ban")
                    {
                        throw new DonHangServiceException(
                            409,
                            "Sản phẩm \"" +
                            bienThe.SanPham.Ten +
                            "\" hiện không còn được kinh doanh."
                        );
                    }

                    if (dongGioHang.SoLuong <= 0)
                    {
                        throw new DonHangServiceException(
                            400,
                            "Số lượng sản phẩm trong giỏ hàng không hợp lệ."
                        );
                    }

                    if (bienThe.SoLuongTon < dongGioHang.SoLuong)
                    {
                        throw new DonHangServiceException(
                            409,
                            "Sản phẩm \"" +
                            bienThe.SanPham.Ten +
                            "\" không đủ số lượng tồn kho. " +
                            "Hiện chỉ còn " +
                            bienThe.SoLuongTon +
                            " sản phẩm."
                        );
                    }


                    // Lấy giá trực tiếp từ database.
                    // Không sử dụng giá do frontend gửi lên.

                    decimal donGia = bienThe.GiaBan;

                    decimal thanhTien =
                        donGia * dongGioHang.SoLuong;

                    tongTienHang += thanhTien;


                    // Tạo snapshot chi tiết đơn hàng.

                    var chiTiet = new ChiTietDonHang
                    {
                        Id = Guid.NewGuid(),

                        SanPhamId = bienThe.SanPhamId,

                        BienTheSanPhamId = bienThe.Id,

                        TenSanPham = bienThe.SanPham.Ten,

                        Sku = bienThe.Sku,

                        TenKichCo = bienThe.KichCo?.TenHienThi,

                        TenMauSac = bienThe.MauSac?.Ten,

                        SoLuong = dongGioHang.SoLuong,

                        DonGia = donGia,

                        TienGiamGia = 0m,

                        ThanhTien = thanhTien,

                        NgayTao = DateTimeOffset.UtcNow
                    };

                    danhSachChiTietDonHang.Add(chiTiet);
                }


                // -------------------------------------------------
                // BUOC 8: TINH TONG TIEN
                // -------------------------------------------------

                decimal tienGiamGia = 0m;

                // Chưa tích hợp cấu hình phí vận chuyển.
                decimal phiVanChuyen = 0m;

                decimal tongThanhToan =
                    tongTienHang -
                    tienGiamGia +
                    phiVanChuyen;


                // -------------------------------------------------
                // BUOC 9: TAO DON HANG
                // -------------------------------------------------

                DateTimeOffset hienTai = DateTimeOffset.UtcNow;

                Guid donHangId = Guid.NewGuid();

                string maDonHang = TaoMaDonHang();

                var donHang = new DonHang
                {
                    Id = donHangId,

                    MaDonHang = maDonHang,

                    NguoiDungId = nguoiDungId,

                    MaGiamGiaId = null,

                    MaGiamGiaDaApDung = null,

                    TrangThai = "cho_xac_nhan",

                    TrangThaiThanhToan = "cho_thanh_toan",

                    PhuongThucThanhToan = phuongThucThanhToan,

                    TongTienHang = tongTienHang,

                    TienGiamGia = tienGiamGia,

                    PhiVanChuyen = phiVanChuyen,

                    TongThanhToan = tongThanhToan,

                    TienTe = "VND",

                    // Lưu snapshot địa chỉ tại thời điểm đặt hàng.

                    TenNguoiNhan = diaChi.TenNguoiNhan,

                    SoDienThoaiNhan = diaChi.SoDienThoai,

                    TinhThanhNhan = diaChi.TinhThanh,

                    QuanHuyenNhan = diaChi.QuanHuyen,

                    PhuongXaNhan = diaChi.PhuongXa,

                    DiaChiChiTietNhan = diaChi.DiaChiChiTiet,

                    GhiChuKhachHang =
                        string.IsNullOrWhiteSpace(request.GhiChuKhachHang)
                            ? null
                            : request.GhiChuKhachHang.Trim(),

                    LyDoHuy = null,

                    KhoaIdempotent = request.KhoaIdempotent,

                    NgayTao = hienTai,

                    NgayCapNhat = hienTai
                };


                // -------------------------------------------------
                // BUOC 10: GAN ID DON HANG VAO CHI TIET
                // -------------------------------------------------

                foreach (var chiTiet in danhSachChiTietDonHang)
                {
                    chiTiet.DonHangId = donHangId;
                }


                // -------------------------------------------------
                // BUOC 11: TAO BAN GHI THANH TOAN
                // -------------------------------------------------

                var thanhToan = new ThanhToan
                {
                    Id = Guid.NewGuid(),

                    DonHangId = donHangId,

                    CongThanhToan = null,

                    PhuongThuc = phuongThucThanhToan,

                    SoTien = tongThanhToan,

                    TienTe = "VND",

                    // Chưa xác nhận đã nhận được tiền.

                    TrangThai = "cho_thanh_toan",

                    MaGiaoDichNhaCungCap = null,

                    KhoaIdempotent = null,

                    ThoiDiemThanhToan = null,

                    NgayTao = hienTai,

                    NgayCapNhat = hienTai
                };


                // -------------------------------------------------
                // BUOC 12: TAO BAN GHI VAN CHUYEN
                // -------------------------------------------------

                var vanChuyen = new VanChuyen
                {
                    Id = Guid.NewGuid(),

                    DonHangId = donHangId,

                    DonViVanChuyen = null,

                    MaVanDon = null,

                    TrangThai = "cho_xu_ly",

                    ThoiDiemGuiHang = null,

                    ThoiDiemGiaoHang = null,

                    GhiChu = null,

                    NgayTao = hienTai,

                    NgayCapNhat = hienTai
                };


                // -------------------------------------------------
                // BUOC 13: TAO LICH SU TRANG THAI DON HANG
                // -------------------------------------------------

                var lichSuTrangThai = new LichSuTrangThaiDonHang
                {
                    Id = Guid.NewGuid(),

                    DonHangId = donHangId,

                    TrangThaiCu = null,

                    TrangThaiMoi = "cho_xac_nhan",

                    NguoiThucHienId = nguoiDungId,

                    GhiChu = "Khách hàng tạo đơn hàng.",

                    NgayTao = hienTai
                };


                // -------------------------------------------------
                // BUOC 14: TRU TON KHO VA GHI LICH SU TON KHO
                // -------------------------------------------------

                var danhSachLichSuTonKho =
                    new List<LichSuTonKho>();

                foreach (var dongGioHang in danhSachDongGioHang)
                {
                    var bienThe = dongGioHang.BienTheSanPham;

                    // Trừ số lượng tồn kho.

                    bienThe.SoLuongTon -= dongGioHang.SoLuong;

                    bienThe.NgayCapNhat = hienTai;


                    // Ghi lịch sử giao dịch kho.

                    var lichSuTonKho = new LichSuTonKho
                    {
                        Id = Guid.NewGuid(),

                        BienTheSanPhamId = bienThe.Id,

                        DonHangId = donHangId,

                        NguoiThucHienId = nguoiDungId,

                        // Số âm biểu thị xuất kho.

                        SoLuongThayDoi = -dongGioHang.SoLuong,

                        LoaiGiaoDich = "dat_hang",

                        GhiChu = "Đặt hàng " + maDonHang,

                        NgayTao = hienTai
                    };

                    danhSachLichSuTonKho.Add(lichSuTonKho);
                }


                // -------------------------------------------------
                // BUOC 15: THEM DU LIEU VAO DATABASE
                // -------------------------------------------------

                _context.DonHangs.Add(donHang);

                _context.ChiTietDonHangs.AddRange(
                    danhSachChiTietDonHang
                );

                _context.ThanhToans.Add(thanhToan);

                _context.VanChuyens.Add(vanChuyen);

                _context.LichSuTrangThaiDonHangs.Add(
                    lichSuTrangThai
                );

                _context.LichSuTonKhos.AddRange(
                    danhSachLichSuTonKho
                );


                // -------------------------------------------------
                // BUOC 16: XOA GIO HANG SAU KHI DAT HANG
                // -------------------------------------------------

                _context.GioHangChiTiets.RemoveRange(
                    danhSachDongGioHang
                );

                gioHang.NgayCapNhat = hienTai;


                // -------------------------------------------------
                // BUOC 17: LUU VA COMMIT TRANSACTION
                // -------------------------------------------------

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);


                // -------------------------------------------------
                // BUOC 18: TRA RESPONSE
                // -------------------------------------------------

                return ChuyenDoiDto(
                    donHang,
                    danhSachChiTietDonHang
                );
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
        // 2. LAY DANH SACH DON HANG CUA TOI
        // =====================================================

        public async Task<PhanTrangResponseDto<DonHangDanhSachResponseDto>>
            LayDanhSachCuaToiAsync(
                Guid nguoiDungId,
                int trang,
                int kichThuocTrang,
                string? trangThai,
                CancellationToken cancellationToken)
        {
            // -------------------------------------------------
            // KIEM TRA THAM SO PHAN TRANG
            // -------------------------------------------------

            if (trang < 1)
            {
                throw new DonHangServiceException(
                    400,
                    "Số trang phải lớn hơn hoặc bằng 1."
                );
            }

            if (kichThuocTrang < 1 || kichThuocTrang > 50)
            {
                throw new DonHangServiceException(
                    400,
                    "Kích thước trang phải từ 1 đến 50."
                );
            }

            long soLuongBoQua =
                (long)(trang - 1) * kichThuocTrang;

            if (soLuongBoQua > int.MaxValue)
            {
                throw new DonHangServiceException(
                    400,
                    "Số trang yêu cầu quá lớn."
                );
            }


            // -------------------------------------------------
            // TAO QUERY DON HANG
            // -------------------------------------------------

            var query = _context.DonHangs
                .AsNoTracking()
                .Where(x => x.NguoiDungId == nguoiDungId);


            // -------------------------------------------------
            // LOC THEO TRANG THAI
            // -------------------------------------------------

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
                    throw new DonHangServiceException(
                        400,
                        "Trạng thái đơn hàng không hợp lệ."
                    );
                }

                query = query.Where(x => x.TrangThai == trangThai);
            }


            // -------------------------------------------------
            // DEM TONG SO DON HANG
            // -------------------------------------------------

            int tongSoBanGhi = await query.CountAsync(
                cancellationToken
            );


            // -------------------------------------------------
            // LAY DANH SACH DON HANG THEO TRANG
            // -------------------------------------------------

            var danhSach = await query

                .OrderByDescending(x => x.NgayTao)

                .ThenByDescending(x => x.Id)

                .Skip((int)soLuongBoQua)

                .Take(kichThuocTrang)

                .Select(x => new DonHangDanhSachResponseDto
                {
                    Id = x.Id,

                    MaDonHang = x.MaDonHang,

                    TrangThai = x.TrangThai,

                    TrangThaiThanhToan = x.TrangThaiThanhToan,

                    PhuongThucThanhToan = x.PhuongThucThanhToan,

                    TongTienHang = x.TongTienHang,

                    TienGiamGia = x.TienGiamGia,

                    PhiVanChuyen = x.PhiVanChuyen,

                    TongThanhToan = x.TongThanhToan,

                    TenNguoiNhan = x.TenNguoiNhan,

                    SoLoaiSanPham = x.ChiTietDonHangs.Count(),

                    TongSoLuongSanPham =
                        x.ChiTietDonHangs.Sum(ct => (int?)ct.SoLuong) ?? 0,

                    NgayTao = x.NgayTao
                })

                .ToListAsync(cancellationToken);


            // -------------------------------------------------
            // TINH TONG SO TRANG
            // -------------------------------------------------

            int tongSoTrang = (int)Math.Ceiling(
                tongSoBanGhi / (double)kichThuocTrang
            );


            // -------------------------------------------------
            // TRA RESPONSE PHAN TRANG
            // -------------------------------------------------

            return new PhanTrangResponseDto<DonHangDanhSachResponseDto>
            {
                Items = danhSach,

                Trang = trang,

                KichThuocTrang = kichThuocTrang,

                TongSoBanGhi = tongSoBanGhi,

                TongSoTrang = tongSoTrang
            };
        }


        // =====================================================
        // 2. KHOA NGUOI DUNG
        // =====================================================


        private async Task KhoaNguoiDungAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken)
        {
            var danhSachNguoiDung = await _context.NguoiDungs
                .FromSqlInterpolated(
                    $"SELECT * FROM public.nguoi_dung WHERE id = {nguoiDungId} FOR UPDATE"
                )
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var nguoiDung = danhSachNguoiDung.FirstOrDefault();

            if (nguoiDung == null || !nguoiDung.DangHoatDong)
            {
                throw new DonHangServiceException(
                    403,
                    "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa."
                );
            }
        }



        // =====================================================
        // 3. KHOA BIEN THE SAN PHAM
        // =====================================================

        private async Task KhoaBienTheAsync(
            Guid bienTheId,
            CancellationToken cancellationToken)
        {
            var danhSach = await _context.BienTheSanPhams
                .FromSqlInterpolated(
                    $"SELECT * FROM public.bien_the_san_pham WHERE id = {bienTheId} FOR UPDATE"
                )
                .ToListAsync(cancellationToken);

            if (danhSach.Count == 0)
            {
                throw new DonHangServiceException(
                    409,
                    "Một biến thể sản phẩm trong giỏ hàng không còn tồn tại."
                );
            }
        }


        // =====================================================
        // 4. KIEM TRA REQUEST
        // =====================================================

        private static void KiemTraRequest(
            TaoDonHangRequestDto request)
        {
            if (request == null)
            {
                throw new DonHangServiceException(
                    400,
                    "Dữ liệu đặt hàng không hợp lệ."
                );
            }

            if (request.DiaChiGiaoHangId == Guid.Empty)
            {
                throw new DonHangServiceException(
                    400,
                    "Vui lòng chọn địa chỉ giao hàng."
                );
            }

            if (request.KhoaIdempotent == Guid.Empty)
            {
                throw new DonHangServiceException(
                    400,
                    "Mã chống tạo đơn hàng trùng không hợp lệ."
                );
            }

            if (string.IsNullOrWhiteSpace(
                request.PhuongThucThanhToan))
            {
                throw new DonHangServiceException(
                    400,
                    "Vui lòng chọn phương thức thanh toán."
                );
            }

            string phuongThuc =
                request.PhuongThucThanhToan.Trim().ToLowerInvariant();

            if (phuongThuc != "cod")
            {
                throw new DonHangServiceException(
                    400,
                    "Hiện tại chỉ hỗ trợ thanh toán tiền mặt khi nhận hàng (COD)."
                );
            }
        }


        // =====================================================
        // 5. TAO MA DON HANG
        // =====================================================

        private static string TaoMaDonHang()
        {
            string thoiGian = DateTime.UtcNow.ToString(
                "yyyyMMddHHmmss"
            );

            string maNgauNhien = Guid.NewGuid()
                .ToString("N")
                .Substring(0, 10)
                .ToUpperInvariant();

            return "DH" + thoiGian + maNgauNhien;
        }


        // =====================================================
        // 6. CHUYEN DOI RESPONSE DTO
        // =====================================================

        private static DonHangResponseDto ChuyenDoiDto(
            DonHang donHang,
            IEnumerable<ChiTietDonHang> danhSachChiTiet)
        {
            return new DonHangResponseDto
            {
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

                TenNguoiNhan = donHang.TenNguoiNhan,

                SoDienThoaiNhan = donHang.SoDienThoaiNhan,

                TinhThanhNhan = donHang.TinhThanhNhan,

                QuanHuyenNhan = donHang.QuanHuyenNhan,

                PhuongXaNhan = donHang.PhuongXaNhan,

                DiaChiChiTietNhan = donHang.DiaChiChiTietNhan,

                GhiChuKhachHang = donHang.GhiChuKhachHang,

                NgayTao = donHang.NgayTao,

                ChiTietDonHangs = danhSachChiTiet
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
                    .ToList()
            };
        }
    }
}
