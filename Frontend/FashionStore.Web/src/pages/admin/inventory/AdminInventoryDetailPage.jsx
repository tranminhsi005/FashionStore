import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
  Package,
  PackagePlus,
  PackageMinus,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";

import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";

import AdminInventoryTransactionModal from "../../../components/admin/inventory/AdminInventoryTransactionModal";

import {
  layChiTietTonKhoAdmin,
  layLichSuTonKhoAdmin,
} from "../../../services/adminInventoryService";

import { layThongBaoLoi } from "../../../utils/apiError";

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
// TÊN LOẠI GIAO DỊCH
// =====================================================

function layTenLoaiGiaoDich(loai) {
  const cacLoai = {
    nhap_hang: "Nhập hàng",
    xuat_hang: "Xuất hàng",
    dieu_chinh: "Điều chỉnh",
    ban_hang: "Bán hàng",
    hoan_hang: "Hoàn hàng",
  };

  return cacLoai[loai] || loai || "Không xác định";
}

// =====================================================
// COMPONENT
// =====================================================

function AdminInventoryDetailPage() {
  const { bienTheId } = useParams();

  const navigate = useNavigate();

  const [bienThe, setBienThe] = useState(null);

  const [lichSu, setLichSu] = useState({
    items: [],
    trang: 1,
    tongSoTrang: 0,
    tongSoBanGhi: 0,
  });

  const [trangLichSu, setTrangLichSu] = useState(1);

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [thongBaoThanhCong, setThongBaoThanhCong] = useState("");

  const [moModal, setMoModal] = useState(false);

  const [lanTaiLai, setLanTaiLai] = useState(0);

  // ===================================================
  // TẢI CHI TIẾT VÀ LỊCH SỬ
  // ===================================================

  useEffect(() => {
    let dangHoatDong = true;

    async function taiDuLieu() {
      try {
        setDangTai(true);
        setLoi("");

        const [ketQuaChiTiet, ketQuaLichSu] = await Promise.all([
          layChiTietTonKhoAdmin(bienTheId),

          layLichSuTonKhoAdmin(bienTheId, {
            trang: trangLichSu,
            kichThuocTrang: 10,
          }),
        ]);

        if (!dangHoatDong) {
          return;
        }

        setBienThe(ketQuaChiTiet);

        setLichSu({
          items: ketQuaLichSu?.items || [],
          trang: ketQuaLichSu?.trang || 1,
          tongSoTrang: ketQuaLichSu?.tongSoTrang || 0,
          tongSoBanGhi: ketQuaLichSu?.tongSoBanGhi || 0,
        });
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

    taiDuLieu();

    return function () {
      dangHoatDong = false;
    };
  }, [bienTheId, trangLichSu, lanTaiLai]);

  // ===================================================
  // XỬ LÝ KHI GIAO DỊCH THÀNH CÔNG
  // ===================================================

  function xuLyGiaoDichThanhCong(ketQua) {
    setThongBaoThanhCong(
      `Giao dịch thành công. Tồn kho đã cập nhật từ ${ketQua.soLuongTruoc} lên ${ketQua.soLuongSau}.`,
    );

    // Quay lại trang lịch sử đầu tiên để thấy giao dịch mới
    setTrangLichSu(1);

    // Tải lại chi tiết và lịch sử
    setLanTaiLai((giaTri) => giaTri + 1);
  }

  // ===================================================
  // LÀM MỚI
  // ===================================================

  function lamMoi() {
    setThongBaoThanhCong("");
    setLanTaiLai((giaTri) => giaTri + 1);
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (dangTai && !bienThe) {
    return <Loading label="Đang tải thông tin tồn kho..." />;
  }

  // ===================================================
  // LỖI
  // ===================================================

  if (loi && !bienThe) {
    return (
      <div className="space-y-5">
        <Button
          variant="outline"
          onClick={() => navigate("/admin-preview/ton-kho")}
        >
          <ArrowLeft size={16} />
          Quay lại tồn kho
        </Button>

        <div className="border border-danger/20 bg-red-50 p-5 text-sm text-danger">
          {loi}
        </div>
      </div>
    );
  }

  if (!bienThe) {
    return null;
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <Link
          to="/admin-preview/ton-kho"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft size={15} />
          Quay lại danh sách tồn kho
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-muted">ADMIN / INVENTORY / DETAIL</p>

            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] md:text-4xl">
              Chi tiết tồn kho
            </h1>

            <p className="mt-3 text-sm text-muted">
              Quản lý số lượng tồn của một biến thể sản phẩm.
            </p>
          </div>

          <Button variant="outline" onClick={lamMoi} disabled={dangTai}>
            <RefreshCw size={16} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* THÔNG BÁO */}

      {thongBaoThanhCong && (
        <div className="border border-success/20 bg-green-50 p-4 text-sm text-success">
          {thongBaoThanhCong}
        </div>
      )}

      {loi && (
        <div className="border border-danger/20 bg-red-50 p-4 text-sm text-danger">
          {loi}
        </div>
      )}

      {/* THÔNG TIN BIẾN THỂ */}

      <section className="border border-line bg-white">
        <div className="border-b border-line p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-paper-dark">
              <Package size={22} />
            </div>

            <div>
              <h2 className="font-display text-lg font-bold">
                Thông tin biến thể
              </h2>

              <p className="mt-1 text-xs text-muted">
                Mã biến thể: {bienThe.bienTheSanPhamId}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs text-muted">Tên sản phẩm</p>

            <p className="mt-2 text-sm font-bold">{bienThe.tenSanPham}</p>
          </div>

          <div>
            <p className="text-xs text-muted">SKU</p>

            <p className="mt-2 font-mono text-sm font-semibold">
              {bienThe.sku}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Kích cỡ</p>

            <p className="mt-2 text-sm font-semibold">
              {bienThe.tenKichCo || "Không có"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Màu sắc</p>

            <div className="mt-2 flex items-center gap-2">
              <span
                className="h-4 w-4 rounded-full border border-black/10"
                style={{
                  backgroundColor: bienThe.maHex || "#e5e7eb",
                }}
              />

              <span className="text-sm font-semibold">
                {bienThe.tenMauSac || "Không có"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TỒN KHO HIỆN TẠI */}

      <section className="border border-line bg-white p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Số lượng tồn kho hiện tại
            </p>

            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p
                className={`
                  font-display
                  text-6xl
                  font-extrabold
                  tracking-[-0.07em]
                  ${bienThe.soLuongTon === 0 ? "text-danger" : "text-ink"}
                `}
              >
                {bienThe.soLuongTon}
              </p>

              <span className="pb-2 text-sm text-muted">sản phẩm</span>
            </div>

            <p className="mt-3 text-xs text-muted">
              Cập nhật lần cuối: {dinhDangNgay(bienThe.ngayCapNhat)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setMoModal(true)}>
              <PackagePlus size={16} />
              Giao dịch kho
            </Button>
          </div>
        </div>
      </section>

      {/* LỊCH SỬ GIAO DỊCH */}

      <section className="overflow-hidden border border-line bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-line p-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <History size={19} />

              <h2 className="font-display text-lg font-bold">
                Lịch sử tồn kho
              </h2>
            </div>

            <p className="mt-2 text-xs text-muted">
              Tổng cộng {lichSu.tongSoBanGhi} giao dịch được ghi nhận.
            </p>
          </div>
        </div>

        {dangTai ? (
          <Loading label="Đang tải lịch sử..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-paper-dark text-[11px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Thời gian</th>

                    <th className="px-5 py-4 font-semibold">Loại giao dịch</th>

                    <th className="px-5 py-4 text-center font-semibold">
                      Thay đổi
                    </th>

                    <th className="px-5 py-4 font-semibold">Người thực hiện</th>

                    <th className="px-5 py-4 font-semibold">Ghi chú</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {lichSu.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 text-xs text-muted">
                        {dinhDangNgay(item.ngayTao)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold">
                          {layTenLoaiGiaoDich(item.loaiGiaoDich)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`
                            text-sm
                            font-bold
                            ${
                              item.soLuongThayDoi > 0
                                ? "text-success"
                                : item.soLuongThayDoi < 0
                                  ? "text-danger"
                                  : "text-muted"
                            }
                          `}
                        >
                          {item.soLuongThayDoi > 0 ? "+" : ""}
                          {item.soLuongThayDoi}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs">
                        {item.tenNguoiThucHien ||
                          (item.donHangId ? "Đơn hàng" : "Hệ thống")}
                      </td>

                      <td className="max-w-[300px] px-5 py-4 text-xs text-muted">
                        {item.ghiChu || "—"}
                      </td>
                    </tr>
                  ))}

                  {lichSu.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <History
                          size={30}
                          className="mx-auto text-muted-light"
                        />

                        <p className="mt-3 text-sm font-semibold">
                          Chưa có lịch sử giao dịch.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PHÂN TRANG LỊCH SỬ */}

            <div className="flex flex-col gap-4 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">
                Trang {lichSu.trang} / {lichSu.tongSoTrang || 1}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="small"
                  disabled={trangLichSu <= 1}
                  onClick={() => {
                    setTrangLichSu((giaTri) => giaTri - 1);
                  }}
                >
                  <ChevronLeft size={15} />
                  Trước
                </Button>

                <Button
                  variant="outline"
                  size="small"
                  disabled={
                    lichSu.tongSoTrang === 0 ||
                    trangLichSu >= lichSu.tongSoTrang
                  }
                  onClick={() => {
                    setTrangLichSu((giaTri) => giaTri + 1);
                  }}
                >
                  Sau
                  <ChevronRight size={15} />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* MODAL GIAO DỊCH */}

      <AdminInventoryTransactionModal
        isOpen={moModal}
        onClose={() => setMoModal(false)}
        bienThe={bienThe}
        onSuccess={xuLyGiaoDichThanhCong}
      />
    </div>
  );
}

export default AdminInventoryDetailPage;
