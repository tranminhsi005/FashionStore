import { useEffect, useState } from "react";

import { Link, useParams, useLocation } from "react-router-dom";

import { layChiTietDonHang } from "../../services/orderService";

import { dinhDangTienVietNam } from "../../utils/formatCurrency";

import { layThongBaoLoi } from "../../utils/apiError";

import CancelOrderSection from "../../components/order/CancelOrderSection";

// =============================================
// LẤY TÊN TRẠNG THÁI ĐƠN HÀNG
// =============================================

function layTenTrangThai(trangThai) {
  const danhSach = {
    cho_xac_nhan: "Chờ xác nhận",

    da_xac_nhan: "Đã xác nhận",

    dang_chuan_bi: "Đang chuẩn bị hàng",

    dang_giao: "Đang giao hàng",

    da_giao: "Đã giao hàng",

    da_huy: "Đã hủy",
  };

  return danhSach[trangThai] || trangThai || "Chưa xác định";
}

// =============================================
// LẤY MÀU TRẠNG THÁI
// =============================================

function layMauTrangThai(trangThai) {
  switch (trangThai) {
    case "cho_xac_nhan":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "da_xac_nhan":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "dang_chuan_bi":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "dang_giao":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "da_giao":
      return "bg-green-50 text-green-700 border-green-200";

    case "da_huy":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

// =============================================
// LẤY TÊN TRẠNG THÁI THANH TOÁN
// =============================================

function layTenThanhToan(trangThai) {
  const danhSach = {
    cho_thanh_toan: "Chờ thanh toán",

    da_thanh_toan: "Đã thanh toán",

    that_bai: "Thanh toán thất bại",

    da_hoan_tien: "Đã hoàn tiền",

    hoan_tien_mot_phan: "Hoàn tiền một phần",
  };

  return danhSach[trangThai] || trangThai || "Chưa xác định";
}

// =============================================
// ĐỊNH DẠNG NGÀY
// =============================================

function dinhDangNgay(ngay) {
  if (!ngay) {
    return "Chưa xác định";
  }

  return new Date(ngay).toLocaleString("vi-VN");
}

// =============================================
// COMPONENT CHÍNH
// =============================================

export default function OrderDetailPage() {
  const { id } = useParams();

  const location = useLocation();

  const vuaDatHang = location.state?.vuaDatHang === true;

  // Dữ liệu đơn hàng
  const [donHang, setDonHang] = useState(null);

  // Trạng thái tải dữ liệu
  const [dangTai, setDangTai] = useState(true);

  // Thông báo lỗi
  const [loi, setLoi] = useState("");

  // Số lần tải lại đơn hàng
  const [lanTaiLai, setLanTaiLai] = useState(0);

  // =============================================
  // TẢI CHI TIẾT ĐƠN HÀNG
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiChiTietDonHang() {
        setDangTai(true);

        setLoi("");

        try {
          const ketQua = await layChiTietDonHang(id);

          if (!componentConTonTai) {
            return;
          }

          setDonHang(ketQua);
        } catch (error) {
          if (componentConTonTai) {
            setLoi(layThongBaoLoi(error));
            setDonHang(null);
          }
        } finally {
          if (componentConTonTai) {
            setDangTai(false);
          }
        }
      }

      taiChiTietDonHang();

      return function () {
        componentConTonTai = false;
      };
    },
    [id, lanTaiLai],
  );

  // =============================================
  // TẢI LẠI ĐƠN HÀNG SAU KHI HỦY
  // =============================================

  function xuLySauKhiHuy() {
    setLanTaiLai(function (giaTriCu) {
      return giaTriCu + 1;
    });
  }

  // =============================================
  // LOADING
  // =============================================

  if (dangTai) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f6f2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>

          <p className="mt-4 text-sm text-gray-500">
            Đang tải thông tin đơn hàng...
          </p>
        </div>
      </main>
    );
  }

  // =============================================
  // LỖI
  // =============================================

  if (loi || !donHang) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f6f2] px-5 text-center">
        <h1 className="text-3xl font-semibold">Không tìm thấy đơn hàng</h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
          {loi || "Đơn hàng không tồn tại hoặc không thuộc tài khoản của bạn."}
        </p>

        <Link
          to="/don-hang"
          className="mt-7 bg-black px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
        >
          Xem đơn hàng của tôi
        </Link>
      </main>
    );
  }

  // =============================================
  // DỮ LIỆU ĐƠN HÀNG
  // =============================================

  const chiTiet = donHang.chiTietDonHangs || [];

  const coTheHuyDon = ["cho_xac_nhan", "da_xac_nhan"].includes(
    donHang.trangThai,
  );

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:px-12">
        {/* =====================================
            THÔNG BÁO ĐẶT HÀNG THÀNH CÔNG
        ===================================== */}

        {vuaDatHang && (
          <div className="mb-8 border border-green-200 bg-green-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
              Order placed successfully
            </p>

            <h1 className="mt-3 text-2xl font-semibold text-green-800">
              Đặt hàng thành công!
            </h1>

            <p className="mt-2 text-sm leading-7 text-green-700">
              FashionStore đã tiếp nhận đơn hàng của bạn. Chúng tôi sẽ xác nhận
              và chuẩn bị giao hàng.
            </p>
          </div>
        )}

        {/* =====================================
            BREADCRUMB
        ===================================== */}

        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="transition-colors hover:text-black">
            Trang chủ
          </Link>

          <span>/</span>

          <Link to="/don-hang" className="transition-colors hover:text-black">
            Đơn hàng
          </Link>

          <span>/</span>

          <span className="text-black">Chi tiết</span>
        </div>

        {/* =====================================
            HEADER ĐƠN HÀNG
        ===================================== */}

        <div className="mb-10 flex flex-wrap items-start justify-between gap-5 border-b border-gray-200 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Order detail
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Đơn hàng {donHang.maDonHang}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Đặt lúc: {dinhDangNgay(donHang.ngayTao)}
            </p>
          </div>

          <div className="border border-gray-300 bg-white px-5 py-4">
            <p className="text-xs text-gray-400">Trạng thái đơn hàng</p>

            <span
              className={`mt-3 inline-block border px-3 py-2 text-xs font-semibold ${layMauTrangThai(
                donHang.trangThai,
              )}`}
            >
              {layTenTrangThai(donHang.trangThai)}
            </span>
          </div>
        </div>

        {/* =====================================
            KHU VỰC HỦY ĐƠN HÀNG
            Chỉ hiển thị với trạng thái cho phép
        ===================================== */}

        {coTheHuyDon && (
          <CancelOrderSection donHangId={id} onHuyThanhCong={xuLySauKhiHuy} />
        )}

        {/* =====================================
            THÔNG TIN ĐƠN HÀNG
        ===================================== */}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ĐỊA CHỈ GIAO HÀNG */}

          <section className="border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              Địa chỉ giao hàng
            </h2>

            <p className="mt-5 font-semibold">{donHang.tenNguoiNhan}</p>

            <p className="mt-2 text-sm text-gray-500">
              {donHang.soDienThoaiNhan}
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              {donHang.diaChiChiTietNhan}, {donHang.phuongXaNhan},{" "}
              {donHang.quanHuyenNhan && `${donHang.quanHuyenNhan}, `}
              {donHang.tinhThanhNhan}
            </p>
          </section>

          {/* THANH TOÁN */}

          <section className="border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              Thanh toán
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap justify-between gap-3 text-sm">
                <span className="text-gray-500">Phương thức</span>

                <span className="font-medium">
                  {donHang.phuongThucThanhToan === "cod"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : donHang.phuongThucThanhToan}
                </span>
              </div>

              <div className="flex flex-wrap justify-between gap-3 text-sm">
                <span className="text-gray-500">Trạng thái</span>

                <span className="font-medium">
                  {layTenThanhToan(donHang.trangThaiThanhToan)}
                </span>
              </div>

              <div className="flex flex-wrap justify-between gap-3 text-sm">
                <span className="text-gray-500">Tiền tệ</span>

                <span className="font-medium">{donHang.tienTe || "VND"}</span>
              </div>
            </div>
          </section>
        </div>

        {/* =====================================
            DANH SÁCH SẢN PHẨM
        ===================================== */}

        <section className="mt-10 border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Sản phẩm trong đơn hàng</h2>

          <div className="mt-7 divide-y divide-gray-200">
            {chiTiet.length > 0 ? (
              chiTiet.map(function (item) {
                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-5 py-5"
                  >
                    {/* THÔNG TIN SẢN PHẨM */}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.tenSanPham}</p>

                      <p className="mt-2 text-xs text-gray-400">
                        SKU: {item.sku || "Không có"}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {item.tenKichCo || "Không có size"}
                        {" / "}
                        {item.tenMauSac || "Không có màu"}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        Số lượng: {item.soLuong}
                      </p>
                    </div>

                    {/* GIÁ SẢN PHẨM */}

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {dinhDangTienVietNam(item.thanhTien)}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        Đơn giá: {dinhDangTienVietNam(item.donGia)}
                      </p>

                      {item.tienGiamGia > 0 && (
                        <p className="mt-1 text-xs text-green-600">
                          Giảm: {dinhDangTienVietNam(item.tienGiamGia)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">
                Không có thông tin sản phẩm trong đơn hàng.
              </p>
            )}
          </div>
        </section>

        {/* =====================================
            TỔNG THANH TOÁN
        ===================================== */}

        <section className="ml-auto mt-6 max-w-md border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Tổng kết đơn hàng</h2>

          <div className="mt-6 space-y-4 border-b border-gray-200 pb-6">
            {/* TIỀN HÀNG */}

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Tiền hàng</span>

              <span>{dinhDangTienVietNam(donHang.tongTienHang)}</span>
            </div>

            {/* GIẢM GIÁ */}

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Giảm giá</span>

              <span className="text-green-700">
                - {dinhDangTienVietNam(donHang.tienGiamGia)}
              </span>
            </div>

            {/* PHÍ VẬN CHUYỂN */}

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Phí vận chuyển</span>

              <span>{dinhDangTienVietNam(donHang.phiVanChuyen)}</span>
            </div>
          </div>

          {/* TỔNG TIỀN */}

          <div className="flex items-center justify-between gap-4 pt-6">
            <span className="font-semibold">Tổng thanh toán</span>

            <span className="text-xl font-bold">
              {dinhDangTienVietNam(donHang.tongThanhToan)}
            </span>
          </div>
        </section>

        {/* =====================================
            GHI CHÚ KHÁCH HÀNG
        ===================================== */}

        {donHang.ghiChuKhachHang && (
          <section className="mt-8 border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              Ghi chú đơn hàng
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-500">
              {donHang.ghiChuKhachHang}
            </p>
          </section>
        )}

        {/* =====================================
            FOOTER ACTION
        ===================================== */}

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/don-hang"
            className="bg-black px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
          >
            Lịch sử đơn hàng
          </Link>

          <Link
            to="/san-pham"
            className="border border-gray-300 px-7 py-4 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-black"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </main>
  );
}
