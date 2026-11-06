import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { layDanhSachDonHang } from "../../services/orderService";

import { dinhDangTienVietNam } from "../../utils/formatCurrency";

import { layThongBaoLoi } from "../../utils/apiError";

const CAC_TRANG_THAI = [
  {
    value: "",
    label: "Tất cả đơn hàng",
  },

  {
    value: "cho_xac_nhan",
    label: "Chờ xác nhận",
  },

  {
    value: "da_xac_nhan",
    label: "Đã xác nhận",
  },

  {
    value: "dang_chuan_bi",
    label: "Đang chuẩn bị",
  },

  {
    value: "dang_giao",
    label: "Đang giao",
  },

  {
    value: "da_giao",
    label: "Đã giao",
  },

  {
    value: "da_huy",
    label: "Đã hủy",
  },
];

function layTenTrangThai(trangThai) {
  const ketQua = CAC_TRANG_THAI.find(function (item) {
    return item.value === trangThai;
  });

  return ketQua?.label || trangThai;
}

function layMauTrangThai(trangThai) {
  switch (trangThai) {
    case "cho_xac_nhan":
      return "bg-yellow-50 text-yellow-700";

    case "da_xac_nhan":
      return "bg-blue-50 text-blue-700";

    case "dang_chuan_bi":
      return "bg-indigo-50 text-indigo-700";

    case "dang_giao":
      return "bg-purple-50 text-purple-700";

    case "da_giao":
      return "bg-green-50 text-green-700";

    case "da_huy":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

function dinhDangNgay(ngay) {
  if (!ngay) {
    return "Chưa xác định";
  }

  return new Date(ngay).toLocaleString("vi-VN");
}

export default function OrdersPage() {
  const [danhSachDonHang, setDanhSachDonHang] = useState([]);

  const [trangThai, setTrangThai] = useState("");

  const [trang, setTrang] = useState(1);

  const [tongSoTrang, setTongSoTrang] = useState(0);

  const [tongSoBanGhi, setTongSoBanGhi] = useState(0);

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [taiLai, setTaiLai] = useState(0);

  // =============================================
  // TẢI DANH SÁCH ĐƠN HÀNG
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiDonHang() {
        setDangTai(true);

        setLoi("");

        try {
          const ketQua = await layDanhSachDonHang({
            trang: trang,

            kichThuocTrang: 10,

            trangThai: trangThai,
          });

          if (!componentConTonTai) {
            return;
          }

          setDanhSachDonHang(ketQua.items || []);

          setTongSoTrang(ketQua.tongSoTrang || 0);

          setTongSoBanGhi(ketQua.tongSoBanGhi || 0);
        } catch (error) {
          if (componentConTonTai) {
            setLoi(layThongBaoLoi(error));
          }
        } finally {
          if (componentConTonTai) {
            setDangTai(false);
          }
        }
      }

      taiDonHang();

      return function () {
        componentConTonTai = false;
      };
    },
    [trang, trangThai, taiLai],
  );

  // =============================================
  // ĐỔI BỘ LỌC
  // =============================================

  function xuLyDoiTrangThai(giaTri) {
    setTrangThai(giaTri);

    setTrang(1);
  }

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12">
        {/* HEADER */}

        <div className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Order history
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Đơn hàng của tôi
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Theo dõi các đơn hàng bạn đã đặt tại FashionStore.
          </p>
        </div>

        {/* FILTER */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <p className="text-sm text-gray-500">
            Tổng cộng <strong className="text-black">{tongSoBanGhi}</strong> đơn
            hàng
          </p>

          <select
            value={trangThai}
            onChange={(event) => xuLyDoiTrangThai(event.target.value)}
            className="min-w-48 border-b border-gray-300 bg-transparent px-2 py-3 text-sm outline-none focus:border-black"
          >
            {CAC_TRANG_THAI.map(function (item) {
              return (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              );
            })}
          </select>
        </div>

        {/* ERROR */}

        {loi && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            <span>{loi}</span>

            <button
              type="button"
              onClick={() => setTaiLai(taiLai + 1)}
              className="font-semibold underline underline-offset-4"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* LOADING */}

        {dangTai && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map(function (_, index) {
              return (
                <div key={index} className="h-36 animate-pulse bg-gray-200" />
              );
            })}
          </div>
        )}

        {/* EMPTY */}

        {!dangTai && !loi && danhSachDonHang.length === 0 && (
          <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-gray-300 text-center">
            <h2 className="text-2xl font-semibold">Chưa có đơn hàng</h2>

            <p className="mt-3 text-sm text-gray-500">
              Bạn chưa có đơn hàng phù hợp với trạng thái đã chọn.
            </p>

            <Link
              to="/san-pham"
              className="mt-7 bg-black px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        )}

        {/* LIST */}

        {!dangTai && !loi && danhSachDonHang.length > 0 && (
          <div className="space-y-5">
            {danhSachDonHang.map(function (donHang) {
              return (
                <article
                  key={donHang.id}
                  className="border border-gray-200 bg-white p-5 transition-colors hover:border-gray-400 sm:p-7"
                >
                  {/* TOP */}

                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Mã đơn hàng
                      </p>

                      <h3 className="mt-2 text-sm font-bold tracking-wide">
                        {donHang.maDonHang}
                      </h3>

                      <p className="mt-2 text-xs text-gray-400">
                        {dinhDangNgay(donHang.ngayTao)}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${layMauTrangThai(donHang.trangThai)}`}
                    >
                      {layTenTrangThai(donHang.trangThai)}
                    </span>
                  </div>

                  {/* BODY */}

                  <div className="grid grid-cols-1 gap-5 py-6 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-400">Người nhận</p>

                      <p className="mt-2 text-sm font-medium">
                        {donHang.tenNguoiNhan}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Sản phẩm</p>

                      <p className="mt-2 text-sm font-medium">
                        {donHang.soLoaiSanPham} loại
                        {" · "}
                        {donHang.tongSoLuongSanPham} sản phẩm
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Thanh toán</p>

                      <p className="mt-2 text-sm font-medium">
                        {donHang.trangThaiThanhToan === "da_thanh_toan"
                          ? "Đã thanh toán"
                          : "Thanh toán khi nhận hàng"}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM */}

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
                    <div>
                      <p className="text-xs text-gray-400">Tổng thanh toán</p>

                      <p className="mt-1 text-lg font-semibold">
                        {dinhDangTienVietNam(donHang.tongThanhToan)}
                      </p>
                    </div>

                    <Link
                      to={`/don-hang/${donHang.id}`}
                      className="border border-black px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}

        {!dangTai && tongSoTrang > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              type="button"
              disabled={trang <= 1}
              onClick={() => setTrang(trang - 1)}
              className="border border-gray-300 px-5 py-3 text-xs disabled:opacity-30"
            >
              ← Trước
            </button>

            <span className="text-sm text-gray-500">
              Trang {trang} / {tongSoTrang}
            </span>

            <button
              type="button"
              disabled={trang >= tongSoTrang}
              onClick={() => setTrang(trang + 1)}
              className="border border-gray-300 px-5 py-3 text-xs disabled:opacity-30"
            >
              Tiếp →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
