import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  Search,
  RefreshCw,
  Eye,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Truck,
} from "lucide-react";

import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";

import { layDanhSachDonHangAdmin } from "../../../services/adminOrderService";

import { dinhDangTienVietNam } from "../../../utils/formatCurrency";
import { layThongBaoLoi } from "../../../utils/apiError";

// =====================================================
// TRẠNG THÁI ĐƠN HÀNG
// =====================================================

const cacTrangThaiDonHang = [
  {
    value: "",
    label: "Tất cả trạng thái",
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

// =====================================================
// TÊN TRẠNG THÁI
// =====================================================

function layTenTrangThai(trangThai) {
  const item = cacTrangThaiDonHang.find((x) => x.value === trangThai);

  return item?.label || trangThai || "Chưa xác định";
}

// =====================================================
// MÀU TRẠNG THÁI
// =====================================================

function layMauTrangThai(trangThai) {
  const cacMau = {
    cho_xac_nhan: "bg-amber-50 text-amber-700",
    da_xac_nhan: "bg-blue-50 text-blue-700",
    dang_chuan_bi: "bg-indigo-50 text-indigo-700",
    dang_giao: "bg-purple-50 text-purple-700",
    da_giao: "bg-green-50 text-green-700",
    da_huy: "bg-red-50 text-red-700",
  };

  return cacMau[trangThai] || "bg-gray-100 text-gray-600";
}

// =====================================================
// TRẠNG THÁI THANH TOÁN
// =====================================================

function layTenThanhToan(trangThai) {
  const cacTrangThai = {
    cho_thanh_toan: "Chờ thanh toán",
    da_thanh_toan: "Đã thanh toán",
    that_bai: "Thất bại",
    thanh_cong: "Thành công",
    da_hoan_tien: "Đã hoàn tiền",
    hoan_tien_mot_phan: "Hoàn tiền một phần",
  };

  return cacTrangThai[trangThai] || trangThai || "Chưa xác định";
}

// =====================================================
// FORMAT NGÀY
// =====================================================

function dinhDangNgay(ngay) {
  if (!ngay) {
    return "—";
  }

  const giaTriNgay = new Date(ngay);

  if (Number.isNaN(giaTriNgay.getTime())) {
    return "—";
  }

  return giaTriNgay.toLocaleString("vi-VN");
}

// =====================================================
// COMPONENT
// =====================================================

function AdminOrdersPage({ cheDoVanChuyen = false }) {
  const [danhSach, setDanhSach] = useState([]);

  const [trang, setTrang] = useState(1);

  const [tongSoTrang, setTongSoTrang] = useState(0);

  const [tongSoBanGhi, setTongSoBanGhi] = useState(0);

  const [tuKhoa, setTuKhoa] = useState("");

  const [tuKhoaApDung, setTuKhoaApDung] = useState("");

  const [trangThai, setTrangThai] = useState("");

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [lanTaiLai, setLanTaiLai] = useState(0);

  // ===================================================
  // TẢI DANH SÁCH
  // ===================================================

  useEffect(() => {
    let dangHoatDong = true;

    async function taiDanhSach() {
      try {
        setDangTai(true);
        setLoi("");

        const ketQua = await layDanhSachDonHangAdmin({
          trang: trang,
          kichThuocTrang: 10,
          trangThai: trangThai,
          tuKhoa: tuKhoaApDung,
        });

        if (!dangHoatDong) {
          return;
        }

        setDanhSach(ketQua?.items || []);

        setTongSoTrang(ketQua?.tongSoTrang || 0);

        setTongSoBanGhi(ketQua?.tongSoBanGhi || 0);
      } catch (error) {
        if (!dangHoatDong) {
          return;
        }

        setLoi(layThongBaoLoi(error));
        setDanhSach([]);
      } finally {
        if (dangHoatDong) {
          setDangTai(false);
        }
      }
    }

    taiDanhSach();

    return function () {
      dangHoatDong = false;
    };
  }, [trang, trangThai, tuKhoaApDung, lanTaiLai]);

  // ===================================================
  // TÌM KIẾM
  // ===================================================

  function xuLyTimKiem(event) {
    event.preventDefault();

    setTrang(1);
    setTuKhoaApDung(tuKhoa.trim());

    setLanTaiLai((giaTri) => giaTri + 1);
  }

  // ===================================================
  // LỌC TRẠNG THÁI
  // ===================================================

  function xuLyLocTrangThai(event) {
    setTrangThai(event.target.value);
    setTrang(1);
  }

  // ===================================================
  // LÀM MỚI
  // ===================================================

  function lamMoi() {
    setTuKhoa("");
    setTuKhoaApDung("");
    setTrangThai("");
    setTrang(1);

    setLanTaiLai((giaTri) => giaTri + 1);
  }

  // ===================================================
  // THỐNG KÊ TRANG HIỆN TẠI
  // ===================================================

  const soDonChoXacNhan = danhSach.filter(
    (x) => x.trangThai === "cho_xac_nhan",
  ).length;

  const soDonDangGiao = danhSach.filter(
    (x) => x.trangThai === "dang_giao",
  ).length;

  // ===================================================
  // GIAO DIỆN
  // ===================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-muted">
            ADMIN / {cheDoVanChuyen ? "SHIPPING" : "ORDERS"}
          </p>

          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] md:text-4xl">
            {cheDoVanChuyen ? "Quản lý vận chuyển" : "Quản lý đơn hàng"}
          </h1>

          <p className="mt-3 text-sm text-muted">
            {cheDoVanChuyen
              ? "Theo dõi các đơn hàng trong quá trình chuẩn bị và giao nhận."
              : "Theo dõi, xác nhận và xử lý các đơn hàng từ khách hàng."}
          </p>
        </div>

        <Button variant="outline" onClick={lamMoi}>
          <RefreshCw size={16} />
          Làm mới
        </Button>
      </div>

      {/* THỐNG KÊ */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-line bg-white p-5">
          <p className="text-xs font-semibold text-muted">
            Tổng đơn theo bộ lọc
          </p>

          <p className="mt-4 font-display text-3xl font-extrabold">
            {tongSoBanGhi.toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="border border-line bg-white p-5">
          <p className="text-xs font-semibold text-muted">
            Chờ xác nhận trên trang
          </p>

          <p className="mt-4 font-display text-3xl font-extrabold text-amber-600">
            {soDonChoXacNhan}
          </p>
        </div>

        <div className="border border-line bg-white p-5">
          <p className="text-xs font-semibold text-muted">
            Đang giao trên trang
          </p>

          <p className="mt-4 font-display text-3xl font-extrabold text-purple-600">
            {soDonDangGiao}
          </p>
        </div>
      </div>

      {/* BỘ LỌC */}

      <section className="border border-line bg-white p-5">
        <form
          onSubmit={xuLyTimKiem}
          className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_240px_auto]"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Tìm kiếm đơn hàng
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                value={tuKhoa}
                onChange={(event) => setTuKhoa(event.target.value)}
                placeholder="Mã đơn, tên khách, email hoặc số điện thoại..."
                className="w-full rounded-control border border-line bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-ink"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Trạng thái đơn hàng
            </label>

            <select
              value={trangThai}
              onChange={xuLyLocTrangThai}
              className="w-full rounded-control border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
            >
              {cacTrangThaiDonHang.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full md:w-auto">
              <Search size={16} />
              Tìm kiếm
            </Button>
          </div>
        </form>
      </section>

      {/* LỖI */}

      {loi && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-danger/20 bg-red-50 p-4 text-sm text-danger">
          <span>{loi}</span>

          <button
            type="button"
            onClick={() => setLanTaiLai((giaTri) => giaTri + 1)}
            className="font-semibold underline underline-offset-4"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* BẢNG ĐƠN HÀNG */}

      <section className="overflow-hidden border border-line bg-white">
        <div className="border-b border-line p-5">
          <div className="flex items-center gap-2">
            {cheDoVanChuyen ? <Truck size={19} /> : <ClipboardList size={19} />}

            <h2 className="font-display text-lg font-bold">
              {cheDoVanChuyen
                ? "Danh sách đơn hàng vận chuyển"
                : "Danh sách đơn hàng"}
            </h2>
          </div>

          <p className="mt-2 text-xs text-muted">
            Tổng cộng {tongSoBanGhi} đơn hàng phù hợp.
          </p>
        </div>

        {dangTai ? (
          <Loading label="Đang tải đơn hàng..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-paper-dark text-[11px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Đơn hàng</th>

                    <th className="px-5 py-4 font-semibold">Khách hàng</th>

                    <th className="px-5 py-4 font-semibold">Người nhận</th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Tổng tiền
                    </th>

                    <th className="px-5 py-4 font-semibold">Thanh toán</th>

                    <th className="px-5 py-4 font-semibold">Trạng thái</th>

                    <th className="px-5 py-4 font-semibold">Ngày tạo</th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Chi tiết
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {danhSach.map((donHang) => (
                    <tr
                      key={donHang.id}
                      className="transition hover:bg-paper/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold">{donHang.maDonHang}</p>

                        <p className="mt-1 font-mono text-[10px] text-muted">
                          {donHang.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold">
                          {donHang.tenKhachHang}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {donHang.emailKhachHang}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm">{donHang.tenNguoiNhan}</p>

                        <p className="mt-1 text-xs text-muted">
                          {donHang.soDienThoaiNhan}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <p className="text-sm font-bold">
                          {dinhDangTienVietNam(donHang.tongThanhToan)}
                        </p>

                        <p className="mt-1 text-[10px] uppercase text-muted">
                          {donHang.phuongThucThanhToan?.toUpperCase()}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold">
                          {layTenThanhToan(donHang.trangThaiThanhToan)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            rounded-pill
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            ${layMauTrangThai(donHang.trangThai)}
                          `}
                        >
                          {layTenTrangThai(donHang.trangThai)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-muted">
                        {dinhDangNgay(donHang.ngayTao)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin-preview/don-hang/${donHang.id}`}
                          className="inline-flex items-center gap-2 rounded-control border border-line px-3 py-2 text-xs font-semibold transition hover:border-ink hover:bg-paper-dark"
                        >
                          <Eye size={15} />
                          Xem
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {danhSach.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center">
                        <ClipboardList
                          size={32}
                          className="mx-auto text-muted-light"
                        />

                        <p className="mt-4 text-sm font-semibold">
                          Không tìm thấy đơn hàng.
                        </p>

                        <p className="mt-2 text-xs text-muted">
                          Hãy thử thay đổi từ khóa hoặc trạng thái lọc.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PHÂN TRANG */}

            <div className="flex flex-col gap-4 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">
                Tổng cộng <strong className="text-ink">{tongSoBanGhi}</strong>{" "}
                đơn · Trang {trang} / {tongSoTrang || 1}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="small"
                  disabled={trang <= 1 || dangTai}
                  onClick={() => setTrang((giaTri) => giaTri - 1)}
                >
                  <ChevronLeft size={15} />
                  Trước
                </Button>

                <Button
                  variant="outline"
                  size="small"
                  disabled={
                    dangTai || tongSoTrang === 0 || trang >= tongSoTrang
                  }
                  onClick={() => setTrang((giaTri) => giaTri + 1)}
                >
                  Sau
                  <ChevronRight size={15} />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminOrdersPage;
