import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
  Package,
  MapPin,
  CreditCard,
  Truck,
  History,
  UserRound,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";

import AdminOrderActionModal from "../../../components/admin/orders/AdminOrderActionModal";

import { layChiTietDonHangAdmin } from "../../../services/adminOrderService";

import { dinhDangTienVietNam } from "../../../utils/formatCurrency";
import { layThongBaoLoi } from "../../../utils/apiError";

// =====================================================
// TRẠNG THÁI ĐƠN HÀNG
// =====================================================

function layTenTrangThai(trangThai) {
  const danhSach = {
    cho_xac_nhan: "Chờ xác nhận",
    da_xac_nhan: "Đã xác nhận",
    dang_chuan_bi: "Đang chuẩn bị",
    dang_giao: "Đang giao",
    da_giao: "Đã giao",
    da_huy: "Đã hủy",
  };

  return danhSach[trangThai] || trangThai || "Chưa xác định";
}

function layMauTrangThai(trangThai) {
  const danhSach = {
    cho_xac_nhan: "bg-amber-50 text-amber-700",
    da_xac_nhan: "bg-blue-50 text-blue-700",
    dang_chuan_bi: "bg-indigo-50 text-indigo-700",
    dang_giao: "bg-purple-50 text-purple-700",
    da_giao: "bg-green-50 text-green-700",
    da_huy: "bg-red-50 text-red-700",
  };

  return danhSach[trangThai] || "bg-gray-100 text-gray-600";
}

// =====================================================
// TRẠNG THÁI VẬN CHUYỂN
// =====================================================

function layTenTrangThaiVanChuyen(trangThai) {
  const danhSach = {
    cho_xu_ly: "Chờ xử lý",
    da_lay_hang: "Đã lấy hàng",
    dang_giao: "Đang giao",
    giao_that_bai: "Giao thất bại",
    da_giao: "Đã giao",
  };

  return danhSach[trangThai] || trangThai || "Chưa có";
}

// =====================================================
// TRẠNG THÁI THANH TOÁN
// =====================================================

function layTenThanhToan(trangThai) {
  const danhSach = {
    cho_thanh_toan: "Chờ thanh toán",
    da_thanh_toan: "Đã thanh toán",
    that_bai: "Thất bại",
    thanh_cong: "Thành công",
    da_hoan_tien: "Đã hoàn tiền",
    hoan_tien_mot_phan: "Hoàn tiền một phần",
  };

  return danhSach[trangThai] || trangThai || "Chưa xác định";
}

// =====================================================
// NGÀY GIỜ
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
// LẤY DANH SÁCH HÀNH ĐỘNG ĐƯỢC PHÉP
// =====================================================

function layHanhDongDuocPhep(donHang) {
  if (!donHang) {
    return [];
  }

  const trangThaiDon = donHang.trangThai;

  const trangThaiVanChuyen = donHang.trangThaiVanChuyen;

  const danhSach = [];

  // Đơn đã kết thúc không có thao tác tiếp
  if (trangThaiDon === "da_giao" || trangThaiDon === "da_huy") {
    return danhSach;
  }

  // Đơn mới tạo
  if (trangThaiDon === "cho_xac_nhan") {
    danhSach.push("xac_nhan");
  }

  // Đã xác nhận
  if (trangThaiDon === "da_xac_nhan") {
    danhSach.push("chuan_bi");
  }

  // Đang chuẩn bị hàng
  if (trangThaiDon === "dang_chuan_bi") {
    if (trangThaiVanChuyen === "cho_xu_ly") {
      danhSach.push("ban_giao");
      danhSach.push("huy");
    }

    if (trangThaiVanChuyen === "da_lay_hang") {
      danhSach.push("dang_giao");
    }
  }

  // Đang giao
  if (trangThaiDon === "dang_giao") {
    if (trangThaiVanChuyen === "da_lay_hang") {
      danhSach.push("dang_giao");
    }

    if (trangThaiVanChuyen === "dang_giao") {
      danhSach.push("giao_that_bai");

      if (donHang.phuongThucThanhToan === "cod") {
        danhSach.push("xac_nhan_da_giao");
      }
    }

    if (trangThaiVanChuyen === "giao_that_bai") {
      danhSach.push("giao_lai");
    }
  }

  // Admin chỉ hủy trước khi bàn giao cho đơn vị vận chuyển.
  if (
    trangThaiDon !== "dang_giao" &&
    trangThaiVanChuyen === "cho_xu_ly" &&
    !danhSach.includes("huy") &&
    (trangThaiDon === "cho_xac_nhan" || trangThaiDon === "da_xac_nhan")
  ) {
    danhSach.push("huy");
  }

  return danhSach;
}

// =====================================================
// CẤU HÌNH NÚT HÀNH ĐỘNG
// =====================================================

const cauHinhNut = {
  xac_nhan: {
    ten: "Xác nhận đơn",
    variant: "primary",
  },

  chuan_bi: {
    ten: "Bắt đầu chuẩn bị",
    variant: "primary",
  },

  ban_giao: {
    ten: "Bàn giao vận chuyển",
    variant: "primary",
  },

  dang_giao: {
    ten: "Cập nhật đang giao",
    variant: "primary",
  },

  giao_that_bai: {
    ten: "Ghi nhận giao thất bại",
    variant: "danger",
  },

  giao_lai: {
    ten: "Bàn giao giao lại",
    variant: "primary",
  },

  xac_nhan_da_giao: {
    ten: "Xác nhận đã giao COD",
    variant: "primary",
  },

  huy: {
    ten: "Hủy đơn hàng",
    variant: "danger",
  },
};

// =====================================================
// COMPONENT
// =====================================================

function AdminOrderDetailPage() {
  const { id } = useParams();

  const [donHang, setDonHang] = useState(null);

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [thongBao, setThongBao] = useState("");

  const [lanTaiLai, setLanTaiLai] = useState(0);

  const [hanhDongDangChon, setHanhDongDangChon] = useState("");

  // ===================================================
  // TẢI CHI TIẾT ĐƠN HÀNG
  // ===================================================

  useEffect(() => {
    let dangHoatDong = true;

    async function taiChiTiet() {
      try {
        setDangTai(true);
        setLoi("");

        const ketQua = await layChiTietDonHangAdmin(id);

        if (!dangHoatDong) {
          return;
        }

        setDonHang(ketQua);
      } catch (error) {
        if (!dangHoatDong) {
          return;
        }

        setLoi(layThongBaoLoi(error));
      } finally {
        if (dangHoatDong) {
          setDangTai(false);
        }
      }
    }

    taiChiTiet();

    return function () {
      dangHoatDong = false;
    };
  }, [id, lanTaiLai]);

  // ===================================================
  // LÀM MỚI
  // ===================================================

  function lamMoi() {
    setThongBao("");
    setLanTaiLai((giaTri) => giaTri + 1);
  }

  // ===================================================
  // SAU KHI THAO TÁC THÀNH CÔNG
  // ===================================================

  function xuLyThanhCong() {
    setHanhDongDangChon("");
    setThongBao("Đã xử lý đơn hàng thành công. Dữ liệu đang được cập nhật.");

    setLanTaiLai((giaTri) => giaTri + 1);
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (dangTai && !donHang) {
    return <Loading label="Đang tải chi tiết đơn hàng..." />;
  }

  // ===================================================
  // LỖI
  // ===================================================

  if (loi && !donHang) {
    return (
      <div className="space-y-5">
        <Link
          to="/admin-preview/don-hang"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Link>

        <div className="border border-danger/20 bg-red-50 p-5 text-sm text-danger">
          {loi}
        </div>
      </div>
    );
  }

  if (!donHang) {
    return null;
  }

  const danhSachHanhDong = layHanhDongDuocPhep(donHang);

  const diaChiGiaoHang = [
    donHang.diaChiChiTietNhan,
    donHang.phuongXaNhan,
    donHang.quanHuyenNhan,
    donHang.tinhThanhNhan,
  ]
    .filter(Boolean)
    .join(", ");

  // ===================================================
  // GIAO DIỆN
  // ===================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <Link
          to="/admin-preview/don-hang"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft size={15} />
          Quay lại danh sách đơn hàng
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-muted">ADMIN / ORDERS / DETAIL</p>

            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] md:text-4xl">
              Chi tiết đơn hàng
            </h1>

            <p className="mt-3 text-sm text-muted">
              Mã đơn hàng:{" "}
              <strong className="text-ink">{donHang.maDonHang}</strong>
            </p>
          </div>

          <Button variant="outline" onClick={lamMoi} disabled={dangTai}>
            <RefreshCw size={16} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* THÔNG BÁO */}

      {thongBao && (
        <div className="border border-success/20 bg-green-50 p-4 text-sm text-success">
          {thongBao}
        </div>
      )}

      {loi && (
        <div className="border border-danger/20 bg-red-50 p-4 text-sm text-danger">
          {loi}
        </div>
      )}

      {/* TRẠNG THÁI VÀ HÀNH ĐỘNG */}

      <section className="border border-line bg-white p-5">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Trạng thái đơn hàng
            </p>

            <span
              className={`
                mt-3
                inline-flex
                rounded-pill
                px-4
                py-2
                text-xs
                font-bold
                ${layMauTrangThai(donHang.trangThai)}
              `}
            >
              {layTenTrangThai(donHang.trangThai)}
            </span>

            <p className="mt-3 text-xs text-muted">
              Phương thức thanh toán:{" "}
              <strong className="text-ink">
                {donHang.phuongThucThanhToan?.toUpperCase()}
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {danhSachHanhDong.map((maHanhDong) => {
              const cauHinh = cauHinhNut[maHanhDong];

              return (
                <Button
                  key={maHanhDong}
                  variant={cauHinh.variant}
                  onClick={() => {
                    setThongBao("");
                    setHanhDongDangChon(maHanhDong);
                  }}
                >
                  {cauHinh.ten}
                </Button>
              );
            })}
          </div>
        </div>

        {danhSachHanhDong.length === 0 && (
          <div className="mt-5 border-t border-line pt-4 text-xs text-muted">
            Đơn hàng hiện không có thao tác quản trị tiếp theo.
          </div>
        )}
      </section>

      {/* THÔNG TIN KHÁCH HÀNG */}

      <section className="border border-line bg-white">
        <div className="flex items-center gap-3 border-b border-line p-5">
          <UserRound size={20} />

          <h2 className="font-display text-lg font-bold">
            Thông tin khách hàng
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted">Họ tên khách hàng</p>

            <p className="mt-2 text-sm font-semibold">{donHang.tenKhachHang}</p>
          </div>

          <div>
            <p className="text-xs text-muted">Email</p>

            <p className="mt-2 break-all text-sm font-semibold">
              {donHang.emailKhachHang}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Mã người dùng</p>

            <p className="mt-2 break-all font-mono text-xs">
              {donHang.nguoiDungId}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Ngày tạo đơn</p>

            <p className="mt-2 text-sm font-semibold">
              {dinhDangNgay(donHang.ngayTao)}
            </p>
          </div>
        </div>
      </section>

      {/* ĐỊA CHỈ NHẬN HÀNG */}

      <section className="border border-line bg-white">
        <div className="flex items-center gap-3 border-b border-line p-5">
          <MapPin size={20} />

          <h2 className="font-display text-lg font-bold">
            Thông tin nhận hàng
          </h2>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs text-muted">Người nhận</p>

            <p className="mt-2 text-sm font-semibold">{donHang.tenNguoiNhan}</p>
          </div>

          <div>
            <p className="text-xs text-muted">Số điện thoại</p>

            <p className="mt-2 text-sm font-semibold">
              {donHang.soDienThoaiNhan}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Địa chỉ</p>

            <p className="mt-2 text-sm leading-6">
              {diaChiGiaoHang || "Không có thông tin địa chỉ."}
            </p>
          </div>

          {donHang.ghiChuKhachHang && (
            <div>
              <p className="text-xs text-muted">Ghi chú của khách hàng</p>

              <p className="mt-2 text-sm leading-6">
                {donHang.ghiChuKhachHang}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CHI TIẾT SẢN PHẨM */}

      <section className="overflow-hidden border border-line bg-white">
        <div className="flex items-center gap-3 border-b border-line p-5">
          <Package size={20} />

          <h2 className="font-display text-lg font-bold">
            Sản phẩm trong đơn hàng
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-paper-dark text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4 font-semibold">Sản phẩm</th>

                <th className="px-5 py-4 font-semibold">SKU</th>

                <th className="px-5 py-4 font-semibold">Phân loại</th>

                <th className="px-5 py-4 text-center font-semibold">
                  Số lượng
                </th>

                <th className="px-5 py-4 text-right font-semibold">Đơn giá</th>

                <th className="px-5 py-4 text-right font-semibold">
                  Thành tiền
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {(donHang.chiTietDonHangs || []).map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <p className="max-w-[260px] text-sm font-semibold">
                      {item.tenSanPham}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-muted">
                    {item.sku}
                  </td>

                  <td className="px-5 py-4 text-xs">
                    <p>Kích cỡ: {item.tenKichCo || "—"}</p>

                    <p className="mt-1">Màu: {item.tenMauSac || "—"}</p>
                  </td>

                  <td className="px-5 py-4 text-center text-sm font-semibold">
                    {item.soLuong}
                  </td>

                  <td className="px-5 py-4 text-right text-sm">
                    {dinhDangTienVietNam(item.donGia)}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-bold">
                    {dinhDangTienVietNam(item.thanhTien)}
                  </td>
                </tr>
              ))}

              {(!donHang.chiTietDonHangs ||
                donHang.chiTietDonHangs.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-muted"
                  >
                    Đơn hàng không có chi tiết sản phẩm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* TỔNG THANH TOÁN */}

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="border border-line bg-white">
          <div className="flex items-center gap-3 border-b border-line p-5">
            <CreditCard size={20} />

            <h2 className="font-display text-lg font-bold">Thanh toán</h2>
          </div>

          <div className="space-y-4 p-5">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted">Phương thức</span>

              <strong>{donHang.phuongThucThanhToan?.toUpperCase()}</strong>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted">Trạng thái thanh toán</span>

              <strong>{layTenThanhToan(donHang.trangThaiThanhToan)}</strong>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted">Trạng thái giao dịch</span>

              <strong>
                {layTenThanhToan(donHang.trangThaiGiaoDichThanhToan)}
              </strong>
            </div>

            {donHang.soTienThanhToan !== null &&
              donHang.soTienThanhToan !== undefined && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted">Số tiền thanh toán</span>

                  <strong>
                    {dinhDangTienVietNam(donHang.soTienThanhToan)}
                  </strong>
                </div>
              )}
          </div>
        </div>

        <div className="border border-line bg-white">
          <div className="border-b border-line p-5">
            <h2 className="font-display text-lg font-bold">
              Tổng kết đơn hàng
            </h2>
          </div>

          <div className="space-y-4 p-5">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted">Tổng tiền hàng</span>

              <span>{dinhDangTienVietNam(donHang.tongTienHang)}</span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted">Giảm giá</span>

              <span>-{dinhDangTienVietNam(donHang.tienGiamGia)}</span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted">Phí vận chuyển</span>

              <span>{dinhDangTienVietNam(donHang.phiVanChuyen)}</span>
            </div>

            <div className="flex justify-between gap-4 border-t border-line pt-4">
              <strong className="text-sm">Tổng thanh toán</strong>

              <strong className="font-display text-xl">
                {dinhDangTienVietNam(donHang.tongThanhToan)}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* THÔNG TIN VẬN CHUYỂN */}

      <section className="border border-line bg-white">
        <div className="flex items-center gap-3 border-b border-line p-5">
          <Truck size={20} />

          <h2 className="font-display text-lg font-bold">
            Thông tin vận chuyển
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted">Trạng thái vận chuyển</p>

            <p className="mt-2 text-sm font-semibold">
              {layTenTrangThaiVanChuyen(donHang.trangThaiVanChuyen)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Đơn vị vận chuyển</p>

            <p className="mt-2 text-sm font-semibold">
              {donHang.donViVanChuyen || "Chưa bàn giao"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Mã vận đơn</p>

            <p className="mt-2 font-mono text-sm font-semibold">
              {donHang.maVanDon || "Chưa có"}
            </p>
          </div>
        </div>
      </section>

      {/* LỊCH SỬ TRẠNG THÁI */}

      <section className="border border-line bg-white">
        <div className="flex items-center gap-3 border-b border-line p-5">
          <History size={20} />

          <h2 className="font-display text-lg font-bold">
            Lịch sử trạng thái đơn hàng
          </h2>
        </div>

        <div className="space-y-5 p-5">
          {[...(donHang.lichSuTrangThai || [])].reverse().map((item, index) => (
            <div key={`${item.ngayTao}-${index}`} className="flex gap-4">
              <div className="mt-1">
                {item.trangThaiMoi === "da_huy" ? (
                  <XCircle size={19} className="text-danger" />
                ) : (
                  <CheckCircle2 size={19} className="text-success" />
                )}
              </div>

              <div className="min-w-0 flex-1 border-b border-line pb-5 last:border-0 last:pb-0">
                <p className="text-sm font-semibold">
                  {layTenTrangThai(item.trangThaiMoi)}
                </p>

                {item.trangThaiCu && (
                  <p className="mt-1 text-xs text-muted">
                    Từ: {layTenTrangThai(item.trangThaiCu)}
                  </p>
                )}

                {item.ghiChu && (
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {item.ghiChu}
                  </p>
                )}

                <p className="mt-2 text-[11px] text-muted">
                  {dinhDangNgay(item.ngayTao)}
                </p>
              </div>
            </div>
          ))}

          {(!donHang.lichSuTrangThai ||
            donHang.lichSuTrangThai.length === 0) && (
            <p className="text-sm text-muted">
              Chưa có lịch sử thay đổi trạng thái.
            </p>
          )}
        </div>
      </section>

      {/* MODAL HÀNH ĐỘNG */}

      <AdminOrderActionModal
        isOpen={Boolean(hanhDongDangChon)}
        onClose={() => setHanhDongDangChon("")}
        donHang={donHang}
        loaiHanhDong={hanhDongDangChon}
        onSuccess={xuLyThanhCong}
      />
    </div>
  );
}

export default AdminOrderDetailPage;
