
using FashionStore.API.Data;
using FashionStore.API.DTOs.Payments;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Services
{
    public class ThanhToanService : IThanhToanService
    {
        private readonly AppDbContext _context;

        public ThanhToanService(AppDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // 1. ADMIN XAC NHAN DA GIAO VA THU TIEN COD
        // =====================================================

        public async Task<XacNhanDaGiaoCODResponseDto>
            XacNhanDaGiaoCODAsync(
                Guid adminId,
                Guid donHangId,
                XacNhanDaGiaoCODRequestDto request,
                CancellationToken cancellationToken)
        {
            KiemTraRequest(adminId, donHangId, request);


            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                // -------------------------------------------------
                // BUOC 1: KHOA DON HANG
                // -------------------------------------------------

                var danhSachDonHang = await _context.DonHangs
                    .FromSqlInterpolated(
                        $"SELECT * FROM public.don_hang WHERE id = {donHangId} FOR UPDATE"
                    )
                    .ToListAsync(cancellationToken);

                var donHang = danhSachDonHang.FirstOrDefault();

                if (donHang == null)
                {
                    throw new ThanhToanServiceException(
                        404,
                        "Không tìm thấy đơn hàng."
                    );
                }


                // -------------------------------------------------
                // BUOC 2: KIEM TRA PHUONG THUC THANH TOAN
                // -------------------------------------------------

                if (donHang.PhuongThucThanhToan != "cod")
                {
                    throw new ThanhToanServiceException(
                        409,
                        "Chức năng này chỉ áp dụng cho đơn hàng thanh toán tiền mặt khi nhận hàng (COD)."
                    );
                }


                // -------------------------------------------------
                // BUOC 3: LAY THONG TIN THANH TOAN
                // -------------------------------------------------

                var thanhToan = await _context.ThanhToans
                    .Where(x => x.DonHangId == donHangId)
                    .OrderByDescending(x => x.NgayTao)
                    .FirstOrDefaultAsync(cancellationToken);

                if (thanhToan == null)
                {
                    throw new ThanhToanServiceException(
                        409,
                        "Không tìm thấy bản ghi thanh toán của đơn hàng."
                    );
                }

                if (thanhToan.PhuongThuc != "cod")
                {
                    throw new ThanhToanServiceException(
                        409,
                        "Phương thức của bản ghi thanh toán không khớp với đơn hàng."
                    );
                }


                // -------------------------------------------------
                // BUOC 4: LAY THONG TIN VAN CHUYEN
                // -------------------------------------------------

                var vanChuyen = await _context.VanChuyens
                    .FirstOrDefaultAsync(
                        x => x.DonHangId == donHangId,
                        cancellationToken
                    );

                if (vanChuyen == null)
                {
                    throw new ThanhToanServiceException(
                        409,
                        "Không tìm thấy thông tin vận chuyển của đơn hàng."
                    );
                }


                // -------------------------------------------------
                // BUOC 5: KIEM TRA REQUEST LAP LAI
                // -------------------------------------------------

                bool daHoanTat =
                    donHang.TrangThai == "da_giao" &&
                    donHang.TrangThaiThanhToan == "da_thanh_toan" &&
                    thanhToan.TrangThai == "thanh_cong" &&
                    vanChuyen.TrangThai == "da_giao";

                if (daHoanTat)
                {
                    await transaction.CommitAsync(cancellationToken);

                    return TaoResponse(
                        donHang,
                        thanhToan,
                        vanChuyen,
                        true
                    );
                }


                // -------------------------------------------------
                // BUOC 6: KIEM TRA TRANG THAI DON HANG
                // -------------------------------------------------

                if (donHang.TrangThai != "dang_giao")
                {
                    throw new ThanhToanServiceException(
                        409,
                        "Chỉ được xác nhận đã giao khi đơn hàng đang ở trạng thái đang giao."
                    );
                }


                // -------------------------------------------------
                // BUOC 7: KIEM TRA TRANG THAI VAN CHUYEN
                // -------------------------------------------------

                if (vanChuyen.TrangThai != "dang_giao")
                {
                    throw new ThanhToanServiceException(
                        409,
                        "Vận chuyển phải ở trạng thái đang giao trước khi xác nhận hoàn tất."
                    );
                }


                // -------------------------------------------------
                // BUOC 8: KIEM TRA DA THU DU TIEN
                // -------------------------------------------------

                if (!request.DaThuDuTien)
                {
                    throw new ThanhToanServiceException(
                        400,
                        "Bạn phải xác nhận đã nhận đủ tiền mặt từ khách hàng."
                    );
                }


                // -------------------------------------------------
                // BUOC 9: KIEM TRA TRANG THAI THANH TOAN HIEN TAI
                // -------------------------------------------------

                if (donHang.TrangThaiThanhToan != "cho_thanh_toan" ||
                    thanhToan.TrangThai != "cho_thanh_toan")
                {
                    throw new ThanhToanServiceException(
                        409,
                        "Trạng thái thanh toán hiện tại không hợp lệ để xác nhận COD."
                    );
                }


                // -------------------------------------------------
                // BUOC 10: CAP NHAT THANH TOAN
                // -------------------------------------------------

                DateTimeOffset hienTai = DateTimeOffset.UtcNow;


                // Bản ghi thanh toán:
                // cho_thanh_toan -> thanh_cong

                thanhToan.TrangThai = "thanh_cong";

                thanhToan.ThoiDiemThanhToan = hienTai;

                thanhToan.NgayCapNhat = hienTai;


                // Đơn hàng:
                // cho_thanh_toan -> da_thanh_toan

                donHang.TrangThaiThanhToan = "da_thanh_toan";


                // -------------------------------------------------
                // BUOC 11: CAP NHAT DON HANG DA GIAO
                // -------------------------------------------------

                string trangThaiDonHangCu = donHang.TrangThai;

                donHang.TrangThai = "da_giao";

                donHang.NgayCapNhat = hienTai;


                // -------------------------------------------------
                // BUOC 12: CAP NHAT VAN CHUYEN
                // -------------------------------------------------

                vanChuyen.TrangThai = "da_giao";

                vanChuyen.ThoiDiemGiaoHang = hienTai;

                vanChuyen.NgayCapNhat = hienTai;


                if (!string.IsNullOrWhiteSpace(request.GhiChu))
                {
                    vanChuyen.GhiChu = request.GhiChu.Trim();
                }
                else
                {
                    vanChuyen.GhiChu =
                        "Đã giao hàng và thu đủ tiền mặt từ khách hàng.";
                }


                // -------------------------------------------------
                // BUOC 13: GHI LICH SU TRANG THAI DON HANG
                // -------------------------------------------------

                var lichSu = new LichSuTrangThaiDonHang
                {
                    Id = Guid.NewGuid(),

                    DonHangId = donHangId,

                    TrangThaiCu = trangThaiDonHangCu,

                    TrangThaiMoi = "da_giao",

                    NguoiThucHienId = adminId,

                    GhiChu = string.IsNullOrWhiteSpace(request.GhiChu)
                        ? "Admin xác nhận đã giao hàng và thu đủ tiền mặt."
                        : request.GhiChu.Trim(),

                    NgayTao = hienTai
                };

                _context.LichSuTrangThaiDonHangs.Add(lichSu);


                // -------------------------------------------------
                // BUOC 14: LUU VA COMMIT TRANSACTION
                // -------------------------------------------------

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);


                // -------------------------------------------------
                // BUOC 15: TRA RESPONSE
                // -------------------------------------------------

                return TaoResponse(
                    donHang,
                    thanhToan,
                    vanChuyen,
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


        // =====================================================
        // 2. KIEM TRA REQUEST
        // =====================================================

        private static void KiemTraRequest(
            Guid adminId,
            Guid donHangId,
            XacNhanDaGiaoCODRequestDto request)
        {
            if (adminId == Guid.Empty)
            {
                throw new ThanhToanServiceException(
                    401,
                    "Không xác định được tài khoản quản trị."
                );
            }

            if (donHangId == Guid.Empty)
            {
                throw new ThanhToanServiceException(
                    400,
                    "ID đơn hàng không hợp lệ."
                );
            }

            if (request == null)
            {
                throw new ThanhToanServiceException(
                    400,
                    "Dữ liệu xác nhận thanh toán không hợp lệ."
                );
            }

            if (!request.DaThuDuTien)
            {
                throw new ThanhToanServiceException(
                    400,
                    "Vui lòng xác nhận đã thu đủ tiền mặt từ khách hàng."
                );
            }
        }


        // =====================================================
        // 3. TAO RESPONSE
        // =====================================================

        private static XacNhanDaGiaoCODResponseDto TaoResponse(
            DonHang donHang,
            ThanhToan thanhToan,
            VanChuyen vanChuyen,
            bool daXacNhanTruocDo)
        {
            return new XacNhanDaGiaoCODResponseDto
            {
                DonHangId = donHang.Id,

                MaDonHang = donHang.MaDonHang,

                TrangThaiDonHang = donHang.TrangThai,

                TrangThaiThanhToan =
                    donHang.TrangThaiThanhToan,

                TrangThaiGiaoDich =
                    thanhToan.TrangThai,

                TrangThaiVanChuyen =
                    vanChuyen.TrangThai,

                PhuongThucThanhToan =
                    donHang.PhuongThucThanhToan,

                SoTienDaThu =
                    thanhToan.SoTien,

                ThoiDiemThanhToan =
                    thanhToan.ThoiDiemThanhToan,

                DaXacNhanTruocDo =
                    daXacNhanTruocDo
            };
        }
    }
}
