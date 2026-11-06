import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  RefreshCw,
  Eye,
  Package,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";

import { layDanhSachTonKhoAdmin } from "../../../services/adminInventoryService";
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
// COMPONENT
// =====================================================

function AdminInventoryPage() {
  const [danhSach, setDanhSach] = useState([]);

  const [phanTrang, setPhanTrang] = useState({
    trang: 1,
    kichThuocTrang: 20,
    tongSoBanGhi: 0,
    tongSoTrang: 0,
  });

  const [tuKhoa, setTuKhoa] = useState("");
  const [tuKhoaApDung, setTuKhoaApDung] = useState("");

  const [conHang, setConHang] = useState("");

  const [trang, setTrang] = useState(1);

  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const [lanTaiLai, setLanTaiLai] = useState(0);

  // ===================================================
  // TẢI DANH SÁCH TỒN KHO
  // ===================================================

  useEffect(() => {
    let dangHoatDong = true;

    async function taiDanhSach() {
      try {
        setDangTai(true);
        setLoi("");

        let giaTriConHang;

        if (conHang === "true") {
          giaTriConHang = true;
        } else if (conHang === "false") {
          giaTriConHang = false;
        }

        const ketQua = await layDanhSachTonKhoAdmin({
          tuKhoa: tuKhoaApDung,
          conHang: giaTriConHang,
          trang: trang,
          kichThuocTrang: 20,
        });

        if (!dangHoatDong) {
          return;
        }

        setDanhSach(ketQua?.items || []);

        setPhanTrang({
          trang: ketQua?.trang || 1,
          kichThuocTrang: ketQua?.kichThuocTrang || 20,
          tongSoBanGhi: ketQua?.tongSoBanGhi || 0,
          tongSoTrang: ketQua?.tongSoTrang || 0,
        });
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
  }, [tuKhoaApDung, conHang, trang, lanTaiLai]);

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
  // LÀM MỚI
  // ===================================================

  function lamMoiDanhSach() {
    setTuKhoa("");
    setTuKhoaApDung("");
    setConHang("");
    setTrang(1);
    setLanTaiLai((giaTri) => giaTri + 1);
  }

  // ===================================================
  // THỐNG KÊ TRÊN TRANG HIỆN TẠI
  // ===================================================

  const soBienTheHetHang = danhSach.filter(
    (item) => item.soLuongTon === 0,
  ).length;

  const soBienTheDangBan = danhSach.filter((item) => item.dangBan).length;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-muted">ADMIN / INVENTORY</p>

          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] md:text-4xl">
            Quản lý tồn kho
          </h1>

          <p className="mt-3 text-sm text-muted">
            Theo dõi số lượng hàng hóa theo từng biến thể sản phẩm.
          </p>
        </div>

        <Button variant="outline" onClick={lamMoiDanhSach}>
          <RefreshCw size={16} />
          Làm mới
        </Button>
      </div>

      {/* THỐNG KÊ */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted">Tổng số biến thể</p>

            <Package size={20} className="text-muted" />
          </div>

          <p className="mt-4 font-display text-3xl font-extrabold">
            {phanTrang.tongSoBanGhi.toLocaleString("vi-VN")}
          </p>

          <p className="mt-2 text-xs text-muted">Theo kết quả lọc hiện tại</p>
        </div>

        <div className="border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted">
              Hết hàng trên trang này
            </p>

            <AlertTriangle size={20} className="text-danger" />
          </div>

          <p className="mt-4 font-display text-3xl font-extrabold text-danger">
            {soBienTheHetHang}
          </p>

          <p className="mt-2 text-xs text-muted">
            Trong {danhSach.length} biến thể đang hiển thị
          </p>
        </div>

        <div className="border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted">
              Đang kinh doanh trên trang này
            </p>

            <Package size={20} className="text-success" />
          </div>

          <p className="mt-4 font-display text-3xl font-extrabold">
            {soBienTheDangBan}
          </p>

          <p className="mt-2 text-xs text-muted">
            Trong {danhSach.length} biến thể đang hiển thị
          </p>
        </div>
      </div>

      {/* TÌM KIẾM VÀ LỌC */}

      <div className="border border-line bg-white p-5">
        <form
          onSubmit={xuLyTimKiem}
          className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px_auto]"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold">Tìm kiếm</label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                value={tuKhoa}
                onChange={(event) => setTuKhoa(event.target.value)}
                placeholder="Nhập tên sản phẩm hoặc SKU..."
                className="w-full rounded-control border border-line bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-ink"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Tình trạng tồn kho
            </label>

            <select
              value={conHang}
              onChange={(event) => {
                setConHang(event.target.value);
                setTrang(1);
              }}
              className="w-full rounded-control border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
            >
              <option value="">Tất cả</option>
              <option value="true">Còn hàng</option>
              <option value="false">Hết hàng</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full md:w-auto">
              <Search size={16} />
              Tìm kiếm
            </Button>
          </div>
        </form>
      </div>

      {/* LỖI */}

      {loi && (
        <div className="border border-danger/20 bg-red-50 p-4 text-sm text-danger">
          {loi}
        </div>
      )}

      {/* BẢNG TỒN KHO */}

      <section className="overflow-hidden border border-line bg-white">
        <div className="border-b border-line p-5">
          <h2 className="font-display text-lg font-bold">Danh sách biến thể</h2>

          <p className="mt-1 text-xs text-muted">
            Mỗi dòng tương ứng với một biến thể sản phẩm.
          </p>
        </div>

        {dangTai ? (
          <Loading label="Đang tải danh sách tồn kho..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-paper-dark text-[11px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Sản phẩm</th>

                    <th className="px-5 py-4 font-semibold">SKU</th>

                    <th className="px-5 py-4 font-semibold">Phân loại</th>

                    <th className="px-5 py-4 text-center font-semibold">
                      Số lượng tồn
                    </th>

                    <th className="px-5 py-4 font-semibold">Kinh doanh</th>

                    <th className="px-5 py-4 font-semibold">Cập nhật</th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {danhSach.map((item) => (
                    <tr
                      key={item.bienTheSanPhamId}
                      className="transition hover:bg-paper/70"
                    >
                      <td className="px-5 py-4">
                        <p className="max-w-[260px] text-sm font-semibold">
                          {item.tenSanPham}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-muted">
                          {item.sku}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1 text-xs">
                          <p>Kích cỡ: {item.tenKichCo || "Không có"}</p>

                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-full border border-black/10"
                              style={{
                                backgroundColor: item.maHex || "#e5e7eb",
                              }}
                            />

                            <span>{item.tenMauSac || "Không có"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`
                            inline-flex
                            min-w-12
                            justify-center
                            rounded-pill
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            ${
                              item.soLuongTon === 0
                                ? "bg-red-50 text-danger"
                                : item.soLuongTon <= 5
                                  ? "bg-amber-50 text-warning"
                                  : "bg-green-50 text-success"
                            }
                          `}
                        >
                          {item.soLuongTon}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            rounded-pill
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            ${
                              item.dangBan
                                ? "bg-green-50 text-success"
                                : "bg-paper-dark text-muted"
                            }
                          `}
                        >
                          {item.dangBan ? "Đang bán" : "Ngừng bán"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-muted">
                        {dinhDangNgay(item.ngayCapNhat)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin-preview/ton-kho/${item.bienTheSanPhamId}`}
                          className="inline-flex items-center gap-2 rounded-control border border-line px-3 py-2 text-xs font-semibold transition hover:border-ink hover:bg-paper-dark"
                        >
                          <Eye size={15} />
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {danhSach.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <Package
                          size={32}
                          className="mx-auto text-muted-light"
                        />

                        <p className="mt-4 text-sm font-semibold">
                          Không tìm thấy biến thể nào.
                        </p>

                        <p className="mt-2 text-xs text-muted">
                          Thử thay đổi từ khóa hoặc bộ lọc tồn kho.
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
                Tổng cộng{" "}
                <strong className="text-ink">{phanTrang.tongSoBanGhi}</strong>{" "}
                biến thể · Trang {phanTrang.trang} /{" "}
                {phanTrang.tongSoTrang || 1}
              </p>

              <div className="flex items-center gap-2">
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
                    dangTai ||
                    phanTrang.tongSoTrang === 0 ||
                    trang >= phanTrang.tongSoTrang
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

export default AdminInventoryPage;
