import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Package,
} from "lucide-react";

import {
  layChiTietSanPhamAdmin,
  layDanhSachKichCoAdmin,
  layDanhSachMauSacAdmin,
  capNhatTrangThaiSanPhamAdmin,
  themBienTheAdmin,
  capNhatBienTheAdmin,
  ngungBienTheAdmin,
} from "../../../services/adminProductService";

import { dinhDangTienVietNam } from "../../../utils/formatCurrency";

import { layThongBaoLoi } from "../../../utils/apiError";

import AdminProductImages from "../../../components/admin/products/AdminProductImages";

// =============================================
// TRẠNG THÁI SẢN PHẨM
// =============================================

const CAC_TRANG_THAI = [
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
// ĐỊNH DẠNG NGÀY
// =============================================

function hienThiNgay(ngay) {
  if (!ngay) {
    return "Chưa xác định";
  }

  const giaTri = new Date(ngay);

  if (Number.isNaN(giaTri.getTime())) {
    return "Chưa xác định";
  }

  return giaTri.toLocaleString("vi-VN");
}

// =============================================
// LẤY TÊN TRẠNG THÁI
// =============================================

function layTenTrangThai(trangThai) {
  const ketQua = CAC_TRANG_THAI.find(function (item) {
    return item.value === trangThai;
  });

  return ketQua?.label || trangThai || "Chưa xác định";
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
// BIẾN THỂ MẶC ĐỊNH
// =============================================

function taoBienTheMacDinh() {
  return {
    kichCoId: "",
    mauSacId: "",
    sku: "",
    giaBan: "",
    giaNiemYet: "",
    soLuongTon: "0",
  };
}

// =============================================
// FORM CHỈNH SỬA BIẾN THỂ
// =============================================

function taoFormSuaBienThe(bienThe) {
  return {
    sku: bienThe.sku || "",
    giaBan: String(bienThe.giaBan ?? ""),
    giaNiemYet: bienThe.giaNiemYet == null ? "" : String(bienThe.giaNiemYet),
    dangBan: Boolean(bienThe.dangBan),
  };
}

// =============================================
// COMPONENT CHÍNH
// =============================================

export default function AdminProductDetailPage() {
  const { id } = useParams();

  // =============================================
  // DỮ LIỆU
  // =============================================

  const [sanPham, setSanPham] = useState(null);

  const [kichCos, setKichCos] = useState([]);

  const [mauSacs, setMauSacs] = useState([]);

  // =============================================
  // TRẠNG THÁI TẢI
  // =============================================

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [loiThaoTac, setLoiThaoTac] = useState("");

  const [thongBao, setThongBao] = useState("");

  const [lanTaiLai, setLanTaiLai] = useState(0);

  // =============================================
  // TRẠNG THÁI SẢN PHẨM
  // =============================================

  const [trangThaiMoi, setTrangThaiMoi] = useState("");

  const [dangCapNhatTrangThai, setDangCapNhatTrangThai] = useState(false);

  // =============================================
  // THÊM BIẾN THỂ
  // =============================================

  const [hienFormThemBienThe, setHienFormThemBienThe] = useState(false);

  const [formBienTheMoi, setFormBienTheMoi] = useState(taoBienTheMacDinh());

  const [dangThemBienThe, setDangThemBienThe] = useState(false);

  // =============================================
  // CHỈNH SỬA BIẾN THỂ
  // =============================================

  const [bienTheDangSuaId, setBienTheDangSuaId] = useState(null);

  const [formSuaBienThe, setFormSuaBienThe] = useState({
    sku: "",
    giaBan: "",
    giaNiemYet: "",
    dangBan: true,
  });

  const [dangLuuBienThe, setDangLuuBienThe] = useState(false);

  const [dangNgungBienTheId, setDangNgungBienTheId] = useState(null);

  // =============================================
  // TẢI THÔNG TIN SẢN PHẨM
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiDuLieu() {
        setDangTai(true);

        setLoi("");

        setLoiThaoTac("");

        try {
          const ketQua = await Promise.all([
            layChiTietSanPhamAdmin(id),
            layDanhSachKichCoAdmin(),
            layDanhSachMauSacAdmin(),
          ]);

          if (!componentConTonTai) {
            return;
          }

          const sanPhamHienTai = ketQua[0];

          setSanPham(sanPhamHienTai);

          setTrangThaiMoi(sanPhamHienTai?.trangThai || "");

          setKichCos(
            Array.isArray(ketQua[1])
              ? ketQua[1].filter(function (item) {
                  return item.dangHoatDong === true;
                })
              : [],
          );

          setMauSacs(
            Array.isArray(ketQua[2])
              ? ketQua[2].filter(function (item) {
                  return item.dangHoatDong === true;
                })
              : [],
          );
        } catch (error) {
          if (componentConTonTai) {
            setLoi(layThongBaoLoi(error));
            setSanPham(null);
          }
        } finally {
          if (componentConTonTai) {
            setDangTai(false);
          }
        }
      }

      taiDuLieu();

      return function () {
        componentConTonTai = false;
      };
    },
    [id, lanTaiLai],
  );

  // =============================================
  // TẢI LẠI SAU KHI CẬP NHẬT
  // =============================================

  function taiLaiThongTin() {
    setLanTaiLai(function (cu) {
      return cu + 1;
    });
  }

  // =============================================
  // CẬP NHẬT TRẠNG THÁI SẢN PHẨM
  // =============================================

  async function xuLyCapNhatTrangThai(event) {
    event.preventDefault();

    if (dangCapNhatTrangThai) {
      return;
    }

    if (!trangThaiMoi) {
      setLoiThaoTac("Vui lòng chọn trạng thái sản phẩm.");
      return;
    }

    setLoiThaoTac("");

    setThongBao("");

    setDangCapNhatTrangThai(true);

    try {
      await capNhatTrangThaiSanPhamAdmin(id, trangThaiMoi);

      setThongBao("Cập nhật trạng thái sản phẩm thành công.");

      taiLaiThongTin();
    } catch (error) {
      setLoiThaoTac(layThongBaoLoi(error));
    } finally {
      setDangCapNhatTrangThai(false);
    }
  }

  // =============================================
  // CẬP NHẬT FORM BIẾN THỂ MỚI
  // =============================================

  function capNhatFormBienTheMoi(tenTruong, giaTri) {
    setFormBienTheMoi(function (cu) {
      return {
        ...cu,
        [tenTruong]: giaTri,
      };
    });
  }

  // =============================================
  // THÊM BIẾN THỂ
  // =============================================

  async function xuLyThemBienThe(event) {
    event.preventDefault();

    if (dangThemBienThe) {
      return;
    }

    const sku = formBienTheMoi.sku.trim();

    const giaBan = Number(formBienTheMoi.giaBan);

    const giaNiemYet =
      formBienTheMoi.giaNiemYet === ""
        ? null
        : Number(formBienTheMoi.giaNiemYet);

    const soLuongTon = Number(formBienTheMoi.soLuongTon);

    if (!sku || sku.length > 100) {
      setLoiThaoTac("SKU phải có từ 1 đến 100 ký tự.");
      return;
    }

    if (!Number.isFinite(giaBan) || giaBan < 0) {
      setLoiThaoTac("Giá bán không hợp lệ.");
      return;
    }

    if (
      giaNiemYet !== null &&
      (!Number.isFinite(giaNiemYet) || giaNiemYet < giaBan)
    ) {
      setLoiThaoTac("Giá niêm yết phải lớn hơn hoặc bằng giá bán.");
      return;
    }

    if (!Number.isInteger(soLuongTon) || soLuongTon < 0) {
      setLoiThaoTac("Số lượng tồn phải là số nguyên không âm.");
      return;
    }

    setLoiThaoTac("");

    setThongBao("");

    setDangThemBienThe(true);

    try {
      const thongTin = {
        kichCoId: formBienTheMoi.kichCoId || null,
        mauSacId: formBienTheMoi.mauSacId || null,
        sku: sku,
        giaBan: giaBan,
        giaNiemYet: giaNiemYet,
        soLuongTon: soLuongTon,
      };

      await themBienTheAdmin(id, thongTin);

      setThongBao("Thêm biến thể thành công.");

      setFormBienTheMoi(taoBienTheMacDinh());

      setHienFormThemBienThe(false);

      taiLaiThongTin();
    } catch (error) {
      setLoiThaoTac(layThongBaoLoi(error));
    } finally {
      setDangThemBienThe(false);
    }
  }

  // =============================================
  // MỞ FORM CHỈNH SỬA BIẾN THỂ
  // =============================================

  function moFormSuaBienThe(bienThe) {
    setLoiThaoTac("");

    setThongBao("");

    setBienTheDangSuaId(bienThe.id);

    setFormSuaBienThe(taoFormSuaBienThe(bienThe));
  }

  // =============================================
  // ĐÓNG FORM CHỈNH SỬA BIẾN THỂ
  // =============================================

  function dongFormSuaBienThe() {
    setBienTheDangSuaId(null);

    setFormSuaBienThe({
      sku: "",
      giaBan: "",
      giaNiemYet: "",
      dangBan: true,
    });
  }

  // =============================================
  // CẬP NHẬT FORM SỬA BIẾN THỂ
  // =============================================

  function capNhatFormSuaBienThe(tenTruong, giaTri) {
    setFormSuaBienThe(function (cu) {
      return {
        ...cu,
        [tenTruong]: giaTri,
      };
    });
  }

  // =============================================
  // LƯU BIẾN THỂ
  // =============================================

  async function xuLyLuuBienThe(event) {
    event.preventDefault();

    if (dangLuuBienThe || !bienTheDangSuaId) {
      return;
    }

    const sku = formSuaBienThe.sku.trim();

    const giaBan = Number(formSuaBienThe.giaBan);

    const giaNiemYet =
      formSuaBienThe.giaNiemYet === ""
        ? null
        : Number(formSuaBienThe.giaNiemYet);

    if (!sku || sku.length > 100) {
      setLoiThaoTac("SKU phải có từ 1 đến 100 ký tự.");
      return;
    }

    if (!Number.isFinite(giaBan) || giaBan < 0) {
      setLoiThaoTac("Giá bán không hợp lệ.");
      return;
    }

    if (
      giaNiemYet !== null &&
      (!Number.isFinite(giaNiemYet) || giaNiemYet < giaBan)
    ) {
      setLoiThaoTac("Giá niêm yết phải lớn hơn hoặc bằng giá bán.");
      return;
    }

    setLoiThaoTac("");

    setThongBao("");

    setDangLuuBienThe(true);

    try {
      await capNhatBienTheAdmin(bienTheDangSuaId, {
        sku: sku,
        giaBan: giaBan,
        giaNiemYet: giaNiemYet,
        dangBan: formSuaBienThe.dangBan,
      });

      setThongBao("Cập nhật biến thể thành công.");

      dongFormSuaBienThe();

      taiLaiThongTin();
    } catch (error) {
      setLoiThaoTac(layThongBaoLoi(error));
    } finally {
      setDangLuuBienThe(false);
    }
  }

  // =============================================
  // NGỪNG KINH DOANH BIẾN THỂ
  // =============================================

  async function xuLyNgungBienThe(bienThe) {
    if (dangNgungBienTheId) {
      return;
    }

    const dongY = window.confirm(
      `Bạn có chắc chắn muốn ngừng kinh doanh biến thể ${bienThe.sku}?`,
    );

    if (!dongY) {
      return;
    }

    setLoiThaoTac("");

    setThongBao("");

    setDangNgungBienTheId(bienThe.id);

    try {
      await ngungBienTheAdmin(bienThe.id);

      setThongBao(`Đã ngừng kinh doanh biến thể ${bienThe.sku}.`);

      taiLaiThongTin();
    } catch (error) {
      setLoiThaoTac(layThongBaoLoi(error));
    } finally {
      setDangNgungBienTheId(null);
    }
  }

  // =============================================
  // LOADING
  // =============================================

  if (dangTai) {
    return (
      <div className="flex min-h-64 items-center justify-center border border-line bg-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-black" />

          <p className="mt-4 text-sm text-muted">
            Đang tải chi tiết sản phẩm...
          </p>
        </div>
      </div>
    );
  }

  // =============================================
  // LỖI KHÔNG TÌM THẤY
  // =============================================

  if (loi || !sanPham) {
    return (
      <div className="border border-red-200 bg-red-50 p-7">
        <h2 className="font-semibold text-red-700">
          Không thể tải thông tin sản phẩm
        </h2>

        <p className="mt-3 text-sm leading-6 text-red-600">
          {loi || "Sản phẩm không tồn tại."}
        </p>

        <Link
          to="/admin-preview/san-pham"
          className="mt-6 inline-flex items-center gap-2 border border-red-300 px-5 py-3 text-xs font-semibold text-red-700"
        >
          <ArrowLeft size={15} />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // =============================================
  // DỮ LIỆU BIẾN THỂ
  // =============================================

  const bienThes = sanPham.bienThes || [];

  const soBienTheDangBan = bienThes.filter(function (item) {
    return item.dangBan;
  }).length;

  const coTheNgungBienTheCuoiCung =
    sanPham.trangThai === "dang_ban" && soBienTheDangBan <= 1;

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <div className="space-y-7">
      {/* =====================================
          BREADCRUMB
      ===================================== */}

      <Link
        to="/admin-preview/san-pham"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} />
        Quay lại danh sách sản phẩm
      </Link>

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Admin / Products / Detail
          </p>

          <h1 className="mt-3 break-words font-display text-3xl font-extrabold tracking-tight">
            {sanPham.ten}
          </h1>

          <p className="mt-2 break-all text-xs text-muted">
            Slug: {sanPham.slug}
          </p>
        </div>

        <Link
          to={`/admin-preview/san-pham/${id}/chinh-sua`}
          className="inline-flex shrink-0 items-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-ink-light"
        >
          <Pencil size={15} />
          Chỉnh sửa
        </Link>
      </div>

      {/* =====================================
          THÔNG BÁO
      ===================================== */}

      {loiThaoTac && (
        <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-600">
          {loiThaoTac}
        </div>
      )}

      {thongBao && (
        <div className="border border-green-200 bg-green-50 px-5 py-4 text-sm leading-6 text-green-700">
          {thongBao}
        </div>
      )}

      {/* =====================================
          THÔNG TIN SẢN PHẨM
      ===================================== */}

      <section className="border border-line bg-white p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <div>
            <h2 className="text-lg font-bold">Thông tin sản phẩm</h2>

            <p className="mt-2 text-xs text-muted">
              Thông tin chung và trạng thái kinh doanh.
            </p>
          </div>

          <span
            className={`px-3 py-2 text-xs font-semibold ${layMauTrangThai(
              sanPham.trangThai,
            )}`}
          >
            {layTenTrangThai(sanPham.trangThai)}
          </span>
        </div>

        {/* THÔNG TIN */}

        <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted">Tên sản phẩm</p>

            <p className="mt-2 text-sm font-semibold">{sanPham.ten}</p>
          </div>

          <div>
            <p className="text-xs text-muted">Danh mục</p>

            <p className="mt-2 text-sm font-medium">
              {sanPham.tenDanhMuc || "Chưa phân loại"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Thương hiệu</p>

            <p className="mt-2 text-sm font-medium">
              {sanPham.tenThuongHieu || "Không có"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Chất liệu</p>

            <p className="mt-2 text-sm font-medium">
              {sanPham.chatLieu || "Chưa cập nhật"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Đối tượng</p>

            <p className="mt-2 text-sm font-medium">
              {sanPham.doiTuong || "Chưa xác định"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Sản phẩm nổi bật</p>

            <p className="mt-2 text-sm font-medium">
              {sanPham.noiBat ? "Có" : "Không"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Tổng số biến thể</p>

            <p className="mt-2 text-sm font-semibold">
              {sanPham.tongSoBienThe}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Biến thể đang bán</p>

            <p className="mt-2 text-sm font-semibold">
              {sanPham.soBienTheDangBan}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Ngày tạo</p>

            <p className="mt-2 text-sm font-medium">
              {hienThiNgay(sanPham.ngayTao)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Ngày cập nhật</p>

            <p className="mt-2 text-sm font-medium">
              {hienThiNgay(sanPham.ngayCapNhat)}
            </p>
          </div>
        </div>

        {/* MÔ TẢ */}

        <div className="mt-7 border-t border-line pt-6">
          <p className="text-xs text-muted">Mô tả sản phẩm</p>

          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">
            {sanPham.moTa || "Chưa có mô tả sản phẩm."}
          </p>
        </div>
      </section>
      {/* =====================================
    QUẢN LÝ HÌNH ẢNH SẢN PHẨM
===================================== */}

      <AdminProductImages sanPhamId={id} />
      {/* =====================================
          CẬP NHẬT TRẠNG THÁI
      ===================================== */}

      <section className="border border-line bg-white p-5 md:p-8">
        <h2 className="text-lg font-bold">Trạng thái kinh doanh</h2>

        <p className="mt-2 text-xs leading-6 text-muted">
          Sản phẩm mới được tạo mặc định ở trạng thái bản nháp. Chỉ chuyển sang
          đang kinh doanh khi đã có ít nhất một biến thể đang bán.
        </p>

        <form
          onSubmit={xuLyCapNhatTrangThai}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <select
            value={trangThaiMoi}
            onChange={function (event) {
              setTrangThaiMoi(event.target.value);
            }}
            className="min-w-0 flex-1 border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink sm:max-w-sm"
          >
            {CAC_TRANG_THAI.map(function (item) {
              return (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              );
            })}
          </select>

          <button
            type="submit"
            disabled={
              dangCapNhatTrangThai || trangThaiMoi === sanPham.trangThai
            }
            className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-ink-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={15} />

            {dangCapNhatTrangThai ? "Đang cập nhật..." : "Cập nhật trạng thái"}
          </button>
        </form>
      </section>

      {/* =====================================
          DANH SÁCH BIẾN THỂ
      ===================================== */}

      <section className="border border-line bg-white p-5 md:p-8">
        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <div>
            <h2 className="text-lg font-bold">Biến thể sản phẩm</h2>

            <p className="mt-2 text-xs text-muted">
              Quản lý SKU, giá bán và trạng thái từng biến thể.
            </p>
          </div>

          {sanPham.trangThai !== "ngung_kinh_doanh" && (
            <button
              type="button"
              onClick={function () {
                setHienFormThemBienThe(!hienFormThemBienThe);
                setLoiThaoTac("");
              }}
              className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest transition hover:bg-ink hover:text-white"
            >
              {hienFormThemBienThe ? <X size={15} /> : <Plus size={15} />}

              {hienFormThemBienThe ? "Đóng form" : "Thêm biến thể"}
            </button>
          )}
        </div>

        {/* =================================
            FORM THÊM BIẾN THỂ
        ================================= */}

        {hienFormThemBienThe && (
          <form
            onSubmit={xuLyThemBienThe}
            className="mt-6 border border-dashed border-line bg-paper/40 p-5"
          >
            <h3 className="text-sm font-bold">Thêm biến thể mới</h3>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* KÍCH CỠ */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Kích cỡ
                </label>

                <select
                  value={formBienTheMoi.kichCoId}
                  onChange={function (event) {
                    capNhatFormBienTheMoi("kichCoId", event.target.value);
                  }}
                  className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                >
                  <option value="">Không chọn</option>

                  {kichCos.map(function (item) {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.tenHienThi}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* MÀU SẮC */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Màu sắc
                </label>

                <select
                  value={formBienTheMoi.mauSacId}
                  onChange={function (event) {
                    capNhatFormBienTheMoi("mauSacId", event.target.value);
                  }}
                  className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                >
                  <option value="">Không chọn</option>

                  {mauSacs.map(function (item) {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.ten}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* SKU */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  SKU *
                </label>

                <input
                  required
                  maxLength={100}
                  value={formBienTheMoi.sku}
                  onChange={function (event) {
                    capNhatFormBienTheMoi("sku", event.target.value);
                  }}
                  placeholder="VD: AT-TRANG-M"
                  className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              {/* GIÁ BÁN */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Giá bán (VNĐ) *
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formBienTheMoi.giaBan}
                  onChange={function (event) {
                    capNhatFormBienTheMoi("giaBan", event.target.value);
                  }}
                  className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              {/* GIÁ NIÊM YẾT */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Giá niêm yết (VNĐ)
                </label>

                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formBienTheMoi.giaNiemYet}
                  onChange={function (event) {
                    capNhatFormBienTheMoi("giaNiemYet", event.target.value);
                  }}
                  className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              {/* TỒN KHO */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Tồn kho ban đầu *
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formBienTheMoi.soLuongTon}
                  onChange={function (event) {
                    capNhatFormBienTheMoi("soLuongTon", event.target.value);
                  }}
                  className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={dangThemBienThe}
                className="bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-ink-light disabled:opacity-50"
              >
                {dangThemBienThe ? "Đang thêm..." : "Lưu biến thể"}
              </button>

              <button
                type="button"
                disabled={dangThemBienThe}
                onClick={function () {
                  setHienFormThemBienThe(false);
                  setFormBienTheMoi(taoBienTheMacDinh());
                }}
                className="border border-line bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:border-ink disabled:opacity-50"
              >
                Hủy
              </button>
            </div>

            <p className="mt-4 text-xs leading-6 text-muted">
              Tồn kho ban đầu được ghi nhận khi tạo biến thể. Quản lý nhập, xuất
              và điều chỉnh tồn kho sẽ thực hiện trong module Tồn kho.
            </p>
          </form>
        )}

        {/* =================================
            DANH SÁCH BIẾN THỂ
        ================================= */}

        <div className="mt-6 space-y-5">
          {bienThes.length === 0 && (
            <div className="flex min-h-40 flex-col items-center justify-center border border-dashed border-line text-center">
              <Package size={28} className="text-gray-300" />

              <p className="mt-3 text-sm text-muted">
                Sản phẩm chưa có biến thể.
              </p>
            </div>
          )}

          {bienThes.map(function (bienThe) {
            const dangSua = bienTheDangSuaId === bienThe.id;

            const dangNgung = dangNgungBienTheId === bienThe.id;

            const coTheNgungBienThe =
              bienThe.dangBan && !coTheNgungBienTheCuoiCung;

            return (
              <article key={bienThe.id} className="border border-line p-5">
                {/* HEADER BIẾN THỂ */}

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-bold">
                      SKU: {bienThe.sku}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>Size: {bienThe.tenKichCo || "Không có"}</span>

                      <span>/</span>

                      <span>Màu: {bienThe.tenMauSac || "Không có"}</span>
                    </div>

                    {bienThe.maHex && (
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className="h-5 w-5 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: bienThe.maHex,
                          }}
                        />

                        <span className="text-xs text-muted">
                          {bienThe.maHex}
                        </span>
                      </div>
                    )}
                  </div>

                  <span
                    className={`shrink-0 px-3 py-2 text-[10px] font-semibold ${
                      bienThe.dangBan
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {bienThe.dangBan ? "ĐANG KINH DOANH" : "NGỪNG KINH DOANH"}
                  </span>
                </div>

                {/* THÔNG TIN GIÁ VÀ TỒN */}

                {!dangSua && (
                  <div className="mt-5 grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted">Giá bán</p>

                      <p className="mt-2 text-sm font-bold">
                        {dinhDangTienVietNam(bienThe.giaBan)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted">Giá niêm yết</p>

                      <p className="mt-2 text-sm font-medium">
                        {bienThe.giaNiemYet == null
                          ? "Không có"
                          : dinhDangTienVietNam(bienThe.giaNiemYet)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted">Số lượng tồn</p>

                      <p className="mt-2 text-sm font-bold">
                        {bienThe.soLuongTon}
                      </p>
                    </div>
                  </div>
                )}

                {/* FORM SỬA */}

                {dangSua && (
                  <form
                    onSubmit={xuLyLuuBienThe}
                    className="mt-6 border-t border-line pt-5"
                  >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold">
                          SKU *
                        </label>

                        <input
                          required
                          maxLength={100}
                          value={formSuaBienThe.sku}
                          onChange={function (event) {
                            capNhatFormSuaBienThe("sku", event.target.value);
                          }}
                          className="w-full border border-line px-3 py-3 text-sm outline-none focus:border-ink"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold">
                          Giá bán (VNĐ) *
                        </label>

                        <input
                          type="number"
                          required
                          min="0"
                          step="1000"
                          value={formSuaBienThe.giaBan}
                          onChange={function (event) {
                            capNhatFormSuaBienThe("giaBan", event.target.value);
                          }}
                          className="w-full border border-line px-3 py-3 text-sm outline-none focus:border-ink"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold">
                          Giá niêm yết (VNĐ)
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={formSuaBienThe.giaNiemYet}
                          onChange={function (event) {
                            capNhatFormSuaBienThe(
                              "giaNiemYet",
                              event.target.value,
                            );
                          }}
                          className="w-full border border-line px-3 py-3 text-sm outline-none focus:border-ink"
                        />
                      </div>

                      <div className="flex items-center">
                        <label className="flex cursor-pointer items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={formSuaBienThe.dangBan}
                            onChange={function (event) {
                              capNhatFormSuaBienThe(
                                "dangBan",
                                event.target.checked,
                              );
                            }}
                            className="h-4 w-4 accent-black"
                          />
                          Đang kinh doanh
                        </label>
                      </div>
                    </div>

                    <div className="mt-5 rounded-control bg-paper p-3 text-xs leading-6 text-muted">
                      Kích cỡ, màu sắc và số lượng tồn không được cập nhật tại
                      form này. Số lượng tồn được quản lý trong module Tồn kho.
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={dangLuuBienThe}
                        className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        <Save size={14} />

                        {dangLuuBienThe ? "Đang lưu..." : "Lưu biến thể"}
                      </button>

                      <button
                        type="button"
                        disabled={dangLuuBienThe}
                        onClick={dongFormSuaBienThe}
                        className="inline-flex items-center gap-2 border border-line px-5 py-3 text-xs font-semibold disabled:opacity-50"
                      >
                        <X size={14} />
                        Hủy chỉnh sửa
                      </button>
                    </div>
                  </form>
                )}

                {/* ACTIONS */}

                {!dangSua && (
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
                    <button
                      type="button"
                      onClick={function () {
                        moFormSuaBienThe(bienThe);
                      }}
                      className="inline-flex items-center gap-2 border border-line px-4 py-3 text-xs font-semibold transition hover:border-ink"
                    >
                      <Pencil size={14} />
                      Chỉnh sửa
                    </button>

                    {bienThe.dangBan && (
                      <button
                        type="button"
                        disabled={!coTheNgungBienThe || dangNgung}
                        title={
                          coTheNgungBienThe
                            ? "Ngừng kinh doanh biến thể"
                            : "Không thể ngừng biến thể cuối cùng của sản phẩm đang kinh doanh"
                        }
                        onClick={function () {
                          xuLyNgungBienThe(bienThe);
                        }}
                        className="inline-flex items-center gap-2 border border-red-200 px-4 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={14} />

                        {dangNgung ? "Đang xử lý..." : "Ngừng kinh doanh"}
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {coTheNgungBienTheCuoiCung && (
          <p className="mt-5 text-xs leading-6 text-amber-700">
            Sản phẩm đang kinh doanh và chỉ còn một biến thể đang bán. Backend
            không cho phép ngừng biến thể cuối cùng. Hãy chuyển sản phẩm sang
            trạng thái ẩn hoặc bản nháp trước khi ngừng biến thể.
          </p>
        )}
      </section>

      {/* =====================================
          FOOTER
      ===================================== */}

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin-preview/san-pham"
          className="bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-ink-light"
        >
          Danh sách sản phẩm
        </Link>

        <Link
          to={`/admin-preview/san-pham/${id}/chinh-sua`}
          className="border border-line bg-white px-6 py-4 text-xs font-semibold uppercase tracking-widest hover:border-ink"
        >
          Chỉnh sửa thông tin
        </Link>
      </div>
    </div>
  );
}
