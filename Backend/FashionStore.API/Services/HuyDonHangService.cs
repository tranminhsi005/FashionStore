
using FashionStore.API.Data;
using FashionStore.API.DTOs.Orders;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Services
{
    public class HuyDonHangService : IHuyDonHangService
    {
        private readonly AppDbContext _context;

        public HuyDonHangService(AppDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // 1. KHACH HANG HUY DON
        // =====================================================

        public async Task<HuyDonHangResponseDto> KhachHangHuyAsync(
            Guid nguoiDungId,
            Guid donHangId,
            HuyDonHangRequestDto request,
            CancellationToken cancellationToken)
        {
            return await HuyDonHangNoiBoAsync(
                nguoiDungId,
                donHangId,
                request,
                false,
                cancellationToken
            );
        }


        // =====================================================
        // 2. ADMIN HUY DON
        // =====================================================

        public async Task<HuyDonHangResponseDto> AdminHuyAsync(
            Guid adminId,
            Guid donHangId,
            HuyDonHangRequestDto request,
            CancellationToken cancellationToken)
        {
            return await HuyDonHangNoiBoAsync(
                adminId,
                donHangId,
                request,
                true,
                cancellationToken
            );
        }


        // =====================================================
        // 3. XU LY HUY DON DUNG CHUNG
        // =====================================================

        private async Task<HuyDonHangResponseDto> HuyDonHangNoiBoAsync(
            Guid nguoiThucHienId,
            Guid donHangId,
            HuyDonHangRequestDto request,
            bool laAdmin,
            CancellationToken cancellationToken)
        {
            KiemTraRequest(
                nguoiThucHienId,
                donHangId,
                request
            );


            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                // -------------------------------------------------
                // BUOC 1: KHOA NGUOI DUNG NEU LA KHACH HANG
                // -------------------------------------------------

                if (!laAdmin)
                {
                    await KhoaNguoiDungAsync(
                        nguoiThucHienId,
                        cancellationToken
                    );
                }


                // -------------------------------------------------
                // BUOC 2: KHOA DON HANG
                // -------------------------------------------------

                var donHang = await KhoaDonHangAsync(
                    donHangId,
                    cancellationToken
                );


                // -------------------------------------------------
                // BUOC 3: KIEM TRA QUYEN SO HUU
                // -------------------------------------------------

                if (!laAdmin &&
                    donHang.NguoiDungId != nguoiThucHienId)
                {
                    throw new HuyDonHangServiceException(
                        404,
                        "Không tìm thấy đơn hàng."
                    );
                }


                // -------------------------------------------------
                // BUOC 4: NEU DA HUY THI KHONG HOAN KHO LAN NUA
                // -------------------------------------------------

                if (donHang.TrangThai == "da_huy")
                {
                    int soLuongDaHoan = await _context.LichSuTonKhos
                        .Where(x =>
                            x.DonHangId == donHangId &&
                            x.LoaiGiaoDich == "huy_don"
                        )
                        .SumAsync(
                            x => (int?)x.SoLuongThayDoi,
                            cancellationToken
                        ) ?? 0;

                    var vanChuyenCu = await _context.VanChuyens
                        .AsNoTracking()
                        .FirstOrDefaultAsync(
                            x => x.DonHangId == donHangId,
                            cancellationToken
                        );

                    await transaction.CommitAsync(cancellationToken);

                    return TaoResponse(
                        donHang,
                        vanChuyenCu,
                        soLuongDaHoan,
                        true
                    );
                }


                // -------------------------------------------------
                // BUOC 5: KIEM TRA TRANG THAI DON HANG
                // -------------------------------------------------

                if (laAdmin)
                {
                    // Admin duoc huy truoc khi ban giao van chuyen.

                    if (donHang.TrangThai != "cho_xac_nhan" &&
                        donHang.TrangThai != "da_xac_nhan" &&
                        donHang.TrangThai != "dang_chuan_bi")
                    {
                        throw new HuyDonHangServiceException(
                            409,
                            "Admin chỉ được hủy đơn khi đơn đang chờ xác nhận, đã xác nhận hoặc đang chuẩn bị."
                        );
                    }
                }
                else
                {
                    // Khach hang chi duoc huy truoc khi bat dau chuan bi.

                    if (donHang.TrangThai != "cho_xac_nhan" &&
                        donHang.TrangThai != "da_xac_nhan")
                    {
                        throw new HuyDonHangServiceException(
                            409,
                            "Bạn chỉ có thể hủy đơn khi đơn đang chờ xác nhận hoặc đã xác nhận."
                        );
                    }
                }


                // -------------------------------------------------
                // BUOC 6: KIEM TRA THANH TOAN
                // -------------------------------------------------

                bool donHangDaThanhToan =
                    donHang.TrangThaiThanhToan == "da_thanh_toan" ||
                    donHang.TrangThaiThanhToan == "da_hoan_tien" ||
                    donHang.TrangThaiThanhToan == "hoan_tien_mot_phan";

                bool giaoDichDangXuLyHoacThanhCong =
                    await _context.ThanhToans.AnyAsync(
                        x =>
                            x.DonHangId == donHangId &&
                            (
                                x.TrangThai == "dang_xu_ly" ||
                                x.TrangThai == "thanh_cong" ||
                                x.TrangThai == "da_hoan_tien"
                            ),
                        cancellationToken
                    );

                if (donHangDaThanhToan ||
                    giaoDichDangXuLyHoacThanhCong)
                {
                    throw new HuyDonHangServiceException(
                        409,
                        "Đơn hàng đã thanh toán hoặc giao dịch đang được xử lý. Không thể tự động hủy vì hệ thống chưa có chức năng hoàn tiền."
                    );
                }


                // -------------------------------------------------
                // BUOC 7: KIEM TRA VAN CHUYEN
                // -------------------------------------------------

                var vanChuyen = await _context.VanChuyens
                    .FirstOrDefaultAsync(
                        x => x.DonHangId == donHangId,
                        cancellationToken
                    );

                if (vanChuyen != null &&
                    vanChuyen.TrangThai != "cho_xu_ly")
                {
                    throw new HuyDonHangServiceException(
                        409,
                        "Đơn hàng đã được bàn giao hoặc đã bắt đầu xử lý vận chuyển. Không thể tự động hủy."
                    );
                }


                // -------------------------------------------------
                // BUOC 8: LAY CHI TIET DON HANG
                // -------------------------------------------------

                var danhSachChiTiet = await _context.ChiTietDonHangs
                    .Where(x => x.DonHangId == donHangId)
                    .ToListAsync(cancellationToken);

                if (danhSachChiTiet.Count == 0)
                {
                    throw new HuyDonHangServiceException(
                        409,
                        "Đơn hàng không có chi tiết sản phẩm để hoàn kho."
                    );
                }


                // Moi chi tiet don hang phai con bien the de hoan kho.

                if (danhSachChiTiet.Any(
                    x => !x.BienTheSanPhamId.HasValue))
                {
                    throw new HuyDonHangServiceException(
                        409,
                        "Một biến thể sản phẩm của đơn hàng không còn tồn tại. Không thể tự động hoàn kho."
                    );
                }


                // BUOC 9: NHOM SO LUONG THEO BIEN THE

                var danhSachNhom = danhSachChiTiet
                    .GroupBy(x => x.BienTheSanPhamId!.Value)
                    .OrderBy(x => x.Key)
                    .Select(x => new
                    {
                        BienTheId = x.Key,

                        SoLuong = x.Sum(ct => ct.SoLuong),

                        Sku = x.First().Sku,

                        TenSanPham = x.First().TenSanPham
                    })
                    .ToList();


                // BUOC 10: KHOA CAC BIEN THE VA HOAN TON KHO

                DateTimeOffset hienTai = DateTimeOffset.UtcNow;

                int tongSoLuongHoanKho = 0;


                foreach (var nhom in danhSachNhom)
                {
                    if (nhom.SoLuong <= 0)
                    {
                        throw new HuyDonHangServiceException(
                            409,
                            "Số lượng sản phẩm trong đơn hàng không hợp lệ."
                        );
                    }


                    // Khoa dong bien the san pham.
                    // SELECT FOR UPDATE giup dong bo voi TonKhoService
                    // va cac thao tac checkout khac.

                    var danhSachBienThe = await _context.BienTheSanPhams
                        .FromSqlInterpolated(
                            $"SELECT * FROM public.bien_the_san_pham WHERE id = {nhom.BienTheId} FOR UPDATE"
                        )
                        .ToListAsync(cancellationToken);


                    var bienThe = danhSachBienThe.FirstOrDefault();

                    if (bienThe == null)
                    {
                        throw new HuyDonHangServiceException(
                            409,
                            "Không tìm thấy biến thể " +
                            nhom.Sku +
                            " để hoàn lại tồn kho."
                        );
                    }


                    // Kiem tra tran so nguyen truoc khi cong kho.

                    if (bienThe.SoLuongTon >
                        int.MaxValue - nhom.SoLuong)
                    {
                        throw new HuyDonHangServiceException(
                            409,
                            "Số lượng tồn kho vượt giới hạn cho phép."
                        );
                    }


                    // Cong lai ton kho.

                    bienThe.SoLuongTon += nhom.SoLuong;

                    bienThe.NgayCapNhat = hienTai;


                    // Tao lich su kho.
                    // So duong (+) bieu thi nhap lai kho.

                    var lichSuTonKho = new LichSuTonKho
                    {
                        Id = Guid.NewGuid(),

                        BienTheSanPhamId = bienThe.Id,

                        DonHangId = donHangId,

                        NguoiThucHienId = nguoiThucHienId,

                        SoLuongThayDoi = nhom.SoLuong,

                        LoaiGiaoDich = "huy_don",

                        GhiChu =
                            "Hoàn tồn kho do hủy đơn " +
                            donHang.MaDonHang +
                            ". Sản phẩm: " +
                            nhom.TenSanPham +
                            ". SKU: " +
                            nhom.Sku,

                        NgayTao = hienTai
                    };

                    _context.LichSuTonKhos.Add(lichSuTonKho);


                    tongSoLuongHoanKho += nhom.SoLuong;
                }


                // BUOC 11: CAP NHAT TRANG THAI DON HANG

                string trangThaiCu = donHang.TrangThai;

                donHang.TrangThai = "da_huy";

                donHang.LyDoHuy = request.LyDoHuy.Trim();

                donHang.NgayCapNhat = hienTai;


                // BUOC 12: CAP NHAT TRANG THAI VAN CHUYEN

                if (vanChuyen != null)
                {
                    vanChuyen.TrangThai = "da_huy";

                    vanChuyen.NgayCapNhat = hienTai;

                    vanChuyen.GhiChu =
                        "Đơn hàng đã bị hủy. Lý do: " +
                        request.LyDoHuy.Trim();
                }

                // BUOC 13: GHI LICH SU TRANG THAI DON HANG

                var lichSuTrangThai = new LichSuTrangThaiDonHang
                {
                    Id = Guid.NewGuid(),

                    DonHangId = donHangId,

                    TrangThaiCu = trangThaiCu,

                    TrangThaiMoi = "da_huy",

                    NguoiThucHienId = nguoiThucHienId,

                    GhiChu = laAdmin
                        ? "Quản trị viên hủy đơn. Lý do: " +
                          request.LyDoHuy.Trim()
                        : "Khách hàng hủy đơn. Lý do: " +
                          request.LyDoHuy.Trim(),

                    NgayTao = hienTai
                };

                _context.LichSuTrangThaiDonHangs.Add(
                    lichSuTrangThai
                );


                // BUOC 14: LUU VA COMMIT

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);


                // BUOC 15: TRA KET QUA

                return TaoResponse(
                    donHang,
                    vanChuyen,
                    tongSoLuongHoanKho,
                    false
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


        // 4. KHOA DONG NGUOI DUNG
        private async Task KhoaNguoiDungAsync(
            Guid nguoiDungId,
            CancellationToken cancellationToken)
        {
            var danhSach = await _context.NguoiDungs
                .FromSqlInterpolated(
                    $"SELECT * FROM public.nguoi_dung WHERE id = {nguoiDungId} FOR UPDATE"
                )
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            if (danhSach.Count == 0 ||
                !danhSach[0].DangHoatDong)
            {
                throw new HuyDonHangServiceException(
                    403,
                    "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa."
                );
            }
        }


        // 5. KHOA DONG DON HANG

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
                throw new HuyDonHangServiceException(
                    404,
                    "Không tìm thấy đơn hàng."
                );
            }

            return donHang;
        }


        // 6. KIEM TRA REQUEST
        private static void KiemTraRequest(
            Guid nguoiThucHienId,
            Guid donHangId,
            HuyDonHangRequestDto request)
        {
            if (nguoiThucHienId == Guid.Empty)
            {
                throw new HuyDonHangServiceException(
                    401,
                    "Không xác định được tài khoản thực hiện."
                );
            }

            if (donHangId == Guid.Empty)
            {
                throw new HuyDonHangServiceException(
                    400,
                    "ID đơn hàng không hợp lệ."
                );
            }

            if (request == null ||
                string.IsNullOrWhiteSpace(request.LyDoHuy))
            {
                throw new HuyDonHangServiceException(
                    400,
                    "Vui lòng nhập lý do hủy đơn hàng."
                );
            }

            string lyDo = request.LyDoHuy.Trim();

            if (lyDo.Length < 3 || lyDo.Length > 500)
            {
                throw new HuyDonHangServiceException(
                    400,
                    "Lý do hủy phải từ 3 đến 500 ký tự."
                );
            }
        }

        // 7. TAO RESPONSE

        private static HuyDonHangResponseDto TaoResponse(
            DonHang donHang,
            VanChuyen? vanChuyen,
            int tongSoLuongHoanKho,
            bool daHuyTruocDo)
        {
            return new HuyDonHangResponseDto
            {
                DonHangId = donHang.Id,

                MaDonHang = donHang.MaDonHang,

                TrangThai = donHang.TrangThai,

                LyDoHuy = donHang.LyDoHuy ?? string.Empty,

                TrangThaiVanChuyen = vanChuyen?.TrangThai,

                TongSoLuongHoanKho = tongSoLuongHoanKho,

                NgayCapNhat = donHang.NgayCapNhat,

                DaHuyTruocDo = daHuyTruocDo
            };
        }
    }
}
