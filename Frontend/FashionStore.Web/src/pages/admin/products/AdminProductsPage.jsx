import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Search, Plus, RefreshCw, Eye, Pencil, Package } from "lucide-react";

import { layDanhSachSanPhamAdmin } from "../../../services/adminProductService";

import { layThongBaoLoi } from "../../../utils/apiError";

// =============================================
// TRẠNG THÁI SẢN PHẨM
// =============================================

const CAC_TRANG_THAI = [
  {
    value: "",
    label: "Tất cả trạng thái",
  },
  {
    value: "nhap",
    label: "Bản nháp",
  },
  {
    value: "dang_ban",
    label: "Đang kinh doanh",
  },
  {
    value: "an",
    label: "Đang ẩn",
  },
  {
    value: "ngung_kinh_doanh",
    label: "Ngừng kinh doanh",
  },
];

// =============================================
// TÊN TRẠNG THÁI
// =============================================

function layTenTrangThai(trangThai) {
  const ketQua = CAC_TRANG_THAI.find(function (item) {
    return item.value === trangThai;
  });

  return ketQua?.label || trangThai || "Không xác định";
}

// =============================================
// MÀU TRẠNG THÁI
// =============================================

function layMauTrangThai(trangThai) {
  switch (trangThai) {
    case "nhap":
      return "bg-gray-100 text-gray-600";

    case "dang_ban":
      return "bg-green-100 text-green-700";

    case "an":
      return "bg-yellow-100 text-yellow-700";

    case "ngung_kinh_doanh":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

// =============================================
// NGÀY THÁNG
// =============================================

function hienThiNgay(ngay) {
  if (!ngay) {
    return "Chưa xác định";
  }

  const giaTriNgay = new Date(ngay);

  if (Number.isNaN(giaTriNgay.getTime())) {
    return "Chưa xác định";
  }

  return giaTriNgay.toLocaleDateString("vi-VN");
}

// =============================================
// COMPONENT
// =============================================

export default function AdminProductsPage() {
  const [danhSachSanPham, setDanhSachSanPham] = useState([]);

  const [tuKhoa, setTuKhoa] = useState("");

  const [tuKhoaDangTim, setTuKhoaDangTim] = useState("");

  const [trangThaiLoc, setTrangThaiLoc] = useState("");

  const [trang, setTrang] = useState(1);

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [lanTaiLai, setLanTaiLai] = useState(0);

  const kichThuocTrang = 10;

  // =============================================
  // TẢI DANH SÁCH SẢN PHẨM
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiDanhSachSanPham() {
        setDangTai(true);

        setLoi("");

        try {
          const ketQua = await layDanhSachSanPhamAdmin(tuKhoaDangTim);

          if (!componentConTonTai) {
            return;
          }

          setDanhSachSanPham(Array.isArray(ketQua) ? ketQua : []);
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

      taiDanhSachSanPham();

      return function () {
        componentConTonTai = false;
      };
    },
    [tuKhoaDangTim, lanTaiLai],
  );

  // =============================================
  // TÌM KIẾM
  // =============================================

  function xuLyTimKiem(event) {
    event.preventDefault();

    setTrang(1);

    setTuKhoaDangTim(tuKhoa.trim());
  }

  // =============================================
  // LỌC VÀ PHÂN TRANG
  // =============================================

  const danhSachSauLoc = danhSachSanPham.filter(function (sanPham) {
    if (!trangThaiLoc) {
      return true;
    }

    return sanPham.trangThai === trangThaiLoc;
  });

  const tongSoTrang = Math.max(
    1,
    Math.ceil(danhSachSauLoc.length / kichThuocTrang),
  );

  const trangHienTai = Math.min(trang, tongSoTrang);

  const viTriBatDau = (trangHienTai - 1) * kichThuocTrang;

  const danhSachHienTai = danhSachSauLoc.slice(
    viTriBatDau,
    viTriBatDau + kichThuocTrang,
  );

  // =============================================
  // LOADING
  // =============================================

  if (dangTai) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Admin / Products
          </p>

          <h1 className="mt-3 font-display text-3xl font-extrabold">
            Quản lý sản phẩm
          </h1>
        </div>

        <div className="flex min-h-64 items-center justify-center border border-line bg-white">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-black" />

            <p className="mt-4 text-sm text-muted">
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <div className="space-y-7">
      {/* HEADER */}

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Admin / Products
          </p>

          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
            Quản lý sản phẩm
          </h1>

          <p className="mt-2 text-sm text-muted">
            Quản lý thông tin, giá bán và biến thể sản phẩm.
          </p>
        </div>

        <Link
          to="/admin-preview/san-pham/them"
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-ink-light"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* THÔNG BÁO LỖI */}

      {loi && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          <span>{loi}</span>

          <button
            type="button"
            onClick={function () {
              setLanTaiLai(function (cu) {
                return cu + 1;
              });
            }}
            className="font-semibold underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* BỘ LỌC */}

      <section className="border border-line bg-white p-5 md:p-6">
        <form
          onSubmit={xuLyTimKiem}
          className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_240px_auto] md:items-end"
        >
          {/* TÌM KIẾM */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Tìm kiếm sản phẩm
            </label>

            <div className="flex items-center border border-line px-4">
              <Search size={17} className="shrink-0 text-muted" />

              <input
                type="text"
                value={tuKhoa}
                onChange={function (event) {
                  setTuKhoa(event.target.value);
                }}
                placeholder="Tên sản phẩm hoặc SKU..."
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>

          {/* TRẠNG THÁI */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Trạng thái
            </label>

            <select
              value={trangThaiLoc}
              onChange={function (event) {
                setTrangThaiLoc(event.target.value);
                setTrang(1);
              }}
              className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
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

          {/* BUTTON */}

          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-ink-light"
            >
              <Search size={15} />
              Tìm kiếm
            </button>

            <button
              type="button"
              title="Tải lại"
              onClick={function () {
                setTuKhoa("");
                setTuKhoaDangTim("");
                setTrangThaiLoc("");
                setTrang(1);

                setLanTaiLai(function (cu) {
                  return cu + 1;
                });
              }}
              className="flex h-11 w-11 items-center justify-center border border-line transition hover:border-ink"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </form>
      </section>

      {/* THÔNG TIN SỐ LƯỢNG */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-white">
            <Package size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              {danhSachSauLoc.length} sản phẩm
            </p>

            <p className="text-xs text-muted">Kết quả trong danh sách đã tải</p>
          </div>
        </div>

        <p className="text-xs text-muted">
          Trang {trangHienTai}/{tongSoTrang}
        </p>
      </div>

      {/* DANH SÁCH */}

      <section className="overflow-hidden border border-line bg-white">
        {/* EMPTY */}

        {danhSachHienTai.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <Package size={35} className="text-gray-300" />

            <h2 className="mt-5 text-lg font-semibold">
              Không tìm thấy sản phẩm
            </h2>

            <p className="mt-2 text-sm text-muted">
              Thử thay đổi từ khóa tìm kiếm hoặc trạng thái lọc.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-paper">
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Sản phẩm
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Danh mục
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Thương hiệu
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Biến thể
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Trạng thái
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-muted">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {danhSachHienTai.map(function (sanPham) {
                    return (
                      <tr
                        key={sanPham.id}
                        className="border-b border-line last:border-b-0 hover:bg-paper/50"
                      >
                        {/* SẢN PHẨM */}

                        <td className="max-w-[300px] px-5 py-5">
                          <p className="truncate text-sm font-semibold">
                            {sanPham.ten}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {sanPham.slug}
                          </p>

                          {sanPham.noiBat && (
                            <span className="mt-2 inline-block bg-accent/40 px-2 py-1 text-[10px] font-bold">
                              NỔI BẬT
                            </span>
                          )}
                        </td>

                        {/* DANH MỤC */}

                        <td className="px-5 py-5 text-sm">
                          {sanPham.tenDanhMuc || "Chưa phân loại"}
                        </td>

                        {/* THƯƠNG HIỆU */}

                        <td className="px-5 py-5 text-sm">
                          {sanPham.tenThuongHieu || "Không có"}
                        </td>

                        {/* BIẾN THỂ */}

                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold">
                            {sanPham.tongSoBienThe || 0}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {sanPham.soBienTheDangBan || 0} đang bán
                          </p>
                        </td>

                        {/* TRẠNG THÁI */}

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex px-3 py-2 text-[10px] font-semibold ${layMauTrangThai(
                              sanPham.trangThai,
                            )}`}
                          >
                            {layTenTrangThai(sanPham.trangThai)}
                          </span>
                        </td>

                        {/* THAO TÁC */}

                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin-preview/san-pham/${sanPham.id}`}
                              title="Chi tiết"
                              className="flex h-9 w-9 items-center justify-center border border-line hover:border-ink"
                            >
                              <Eye size={16} />
                            </Link>

                            <Link
                              to={`/admin-preview/san-pham/${sanPham.id}/chinh-sua`}
                              title="Chỉnh sửa"
                              className="flex h-9 w-9 items-center justify-center border border-line hover:border-ink"
                            >
                              <Pencil size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST */}

            <div className="divide-y divide-line lg:hidden">
              {danhSachHienTai.map(function (sanPham) {
                return (
                  <article key={sanPham.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-semibold">
                          {sanPham.ten}
                        </h3>

                        <p className="mt-1 break-all text-xs text-muted">
                          {sanPham.slug}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 px-2 py-1 text-[10px] font-semibold ${layMauTrangThai(
                          sanPham.trangThai,
                        )}`}
                      >
                        {layTenTrangThai(sanPham.trangThai)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted">Danh mục</p>
                        <p className="mt-1 font-medium">{sanPham.tenDanhMuc}</p>
                      </div>

                      <div>
                        <p className="text-muted">Thương hiệu</p>
                        <p className="mt-1 font-medium">
                          {sanPham.tenThuongHieu || "Không có"}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted">Tổng biến thể</p>
                        <p className="mt-1 font-medium">
                          {sanPham.tongSoBienThe || 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted">Đang bán</p>
                        <p className="mt-1 font-medium">
                          {sanPham.soBienTheDangBan || 0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <Link
                        to={`/admin-preview/san-pham/${sanPham.id}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 border border-line py-3 text-xs font-semibold"
                      >
                        <Eye size={15} />
                        Chi tiết
                      </Link>

                      <Link
                        to={`/admin-preview/san-pham/${sanPham.id}/chinh-sua`}
                        className="inline-flex flex-1 items-center justify-center gap-2 border border-line py-3 text-xs font-semibold"
                      >
                        <Pencil size={15} />
                        Chỉnh sửa
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* PHÂN TRANG */}

      {danhSachSauLoc.length > kichThuocTrang && (
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            disabled={trangHienTai <= 1}
            onClick={function () {
              setTrang(trangHienTai - 1);
            }}
            className="border border-line px-5 py-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Trước
          </button>

          <span className="text-xs text-muted">
            Trang {trangHienTai} / {tongSoTrang}
          </span>

          <button
            type="button"
            disabled={trangHienTai >= tongSoTrang}
            onClick={function () {
              setTrang(trangHienTai + 1);
            }}
            className="border border-line px-5 py-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-30"
          >
            Tiếp →
          </button>
        </div>
      )}

      {/* LƯU Ý VỀ API */}

      <p className="text-xs leading-6 text-muted">
        Lưu ý: API quản trị hiện trả về tối đa 100 sản phẩm mới nhất. Tìm kiếm
        được thực hiện tại backend; lọc trạng thái và phân trang được thực hiện
        trên tập dữ liệu đã tải.
      </p>
    </div>
  );
}
