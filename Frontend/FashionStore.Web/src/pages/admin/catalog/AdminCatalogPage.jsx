import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  X,
  Save,
  Tags,
} from "lucide-react";

import {
  layDanhSachCatalogAdmin,
  taoCatalogAdmin,
  capNhatCatalogAdmin,
  ngungCatalogAdmin,
} from "../../../services/adminCatalogService";

import { layThongBaoLoi } from "../../../utils/apiError";

// =============================================
// CẤU HÌNH CÁC NHÓM DỮ LIỆU
// =============================================

const CAU_HINH = {
  "danh-muc": {
    tieuDe: "Quản lý danh mục",
    moTa: "Quản lý danh mục và danh mục cha của sản phẩm.",

    tenTruong: "ten",

    formMacDinh: {
      ten: "",
      danhMucChaId: "",
      moTa: "",
      thuTuHienThi: "0",
    },

    truong: [
      {
        name: "ten",
        label: "Tên danh mục",
        type: "text",
        required: true,
        maxLength: 150,
        placeholder: "Ví dụ: Áo thun",
      },
      {
        name: "danhMucChaId",
        label: "Danh mục cha",
        type: "parentCategory",
      },
      {
        name: "moTa",
        label: "Mô tả",
        type: "textarea",
      },
      {
        name: "thuTuHienThi",
        label: "Thứ tự hiển thị",
        type: "number",
      },
    ],
  },

  "thuong-hieu": {
    tieuDe: "Quản lý thương hiệu",
    moTa: "Quản lý các thương hiệu thời trang.",

    tenTruong: "ten",

    formMacDinh: {
      ten: "",
      moTa: "",
    },

    truong: [
      {
        name: "ten",
        label: "Tên thương hiệu",
        type: "text",
        required: true,
        minLength: 2,
        maxLength: 150,
        placeholder: "Ví dụ: Nike",
      },
      {
        name: "moTa",
        label: "Mô tả",
        type: "textarea",
      },
    ],
  },

  "kich-co": {
    tieuDe: "Quản lý kích cỡ",
    moTa: "Quản lý mã kích cỡ và thứ tự hiển thị.",

    tenTruong: "tenHienThi",

    formMacDinh: {
      ma: "",
      tenHienThi: "",
      thuTuHienThi: "0",
    },

    truong: [
      {
        name: "ma",
        label: "Mã kích cỡ",
        type: "text",
        required: true,
        maxLength: 30,
        placeholder: "Ví dụ: M, XL, XXL",
      },
      {
        name: "tenHienThi",
        label: "Tên hiển thị",
        type: "text",
        required: true,
        maxLength: 50,
        placeholder: "Ví dụ: Size M",
      },
      {
        name: "thuTuHienThi",
        label: "Thứ tự hiển thị",
        type: "number",
      },
    ],
  },

  "mau-sac": {
    tieuDe: "Quản lý màu sắc",
    moTa: "Quản lý tên màu và mã HEX.",

    tenTruong: "ten",

    formMacDinh: {
      ten: "",
      maHex: "#000000",
      thuTuHienThi: "0",
    },

    truong: [
      {
        name: "ten",
        label: "Tên màu sắc",
        type: "text",
        required: true,
        maxLength: 80,
        placeholder: "Ví dụ: Đen",
      },
      {
        name: "maHex",
        label: "Mã HEX",
        type: "colorText",
        placeholder: "#000000",
      },
      {
        name: "thuTuHienThi",
        label: "Thứ tự hiển thị",
        type: "number",
      },
    ],
  },
};

// =============================================
// TÊN LOẠI DỮ LIỆU
// =============================================

function layTenLoai(loai) {
  return CAU_HINH[loai]?.tieuDe || "Quản lý dữ liệu";
}

// =============================================
// COMPONENT
// =============================================

export default function AdminCatalogPage({ loai }) {
  const cauHinh = CAU_HINH[loai];

  // =============================================
  // STATE DỮ LIỆU
  // =============================================

  const [danhSach, setDanhSach] = useState([]);

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [thongBao, setThongBao] = useState("");

  const [lanTaiLai, setLanTaiLai] = useState(0);

  // =============================================
  // SEARCH
  // =============================================

  const [tuKhoa, setTuKhoa] = useState("");

  // =============================================
  // FORM
  // =============================================

  const [hienForm, setHienForm] = useState(false);

  const [dangSuaId, setDangSuaId] = useState(null);

  const [form, setForm] = useState(cauHinh?.formMacDinh || {});

  const [dangLuu, setDangLuu] = useState(false);

  // =============================================
  // NGỪNG HOẠT ĐỘNG
  // =============================================

  const [dangNgungId, setDangNgungId] = useState(null);

  // =============================================
  // TẢI DANH SÁCH
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiDanhSach() {
        setDangTai(true);

        setLoi("");

        try {
          const ketQua = await layDanhSachCatalogAdmin(loai);

          if (!componentConTonTai) {
            return;
          }

          setDanhSach(Array.isArray(ketQua) ? ketQua : []);
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

      if (cauHinh) {
        taiDanhSach();
      } else {
        setDangTai(false);
        setLoi("Loại dữ liệu quản trị không hợp lệ.");
      }

      return function () {
        componentConTonTai = false;
      };
    },
    [loai, lanTaiLai, cauHinh],
  );

  // =============================================
  // TẢI LẠI
  // =============================================

  function taiLai() {
    setLanTaiLai(function (cu) {
      return cu + 1;
    });
  }

  // =============================================
  // ĐÓNG FORM
  // =============================================

  function dongForm() {
    setHienForm(false);

    setDangSuaId(null);

    setForm(cauHinh.formMacDinh);

    setLoi("");
  }

  // =============================================
  // MỞ FORM TẠO
  // =============================================

  function moFormThem() {
    setDangSuaId(null);

    setForm({
      ...cauHinh.formMacDinh,
    });

    setLoi("");

    setThongBao("");

    setHienForm(true);
  }

  // =============================================
  // MỞ FORM SỬA
  // =============================================

  function moFormSua(item) {
    const formMoi = {};

    cauHinh.truong.forEach(function (truong) {
      formMoi[truong.name] = item[truong.name] ?? "";
    });

    if (loai === "danh-muc") {
      formMoi.danhMucChaId = item.danhMucChaId || "";
    }

    setForm({
      ...cauHinh.formMacDinh,
      ...formMoi,
    });

    setDangSuaId(item.id);

    setLoi("");

    setThongBao("");

    setHienForm(true);
  }

  // =============================================
  // CẬP NHẬT FORM
  // =============================================

  function capNhatForm(tenTruong, giaTri) {
    setForm(function (cu) {
      return {
        ...cu,
        [tenTruong]: giaTri,
      };
    });
  }

  // =============================================
  // KIỂM TRA DỮ LIỆU
  // =============================================

  function kiemTraForm() {
    for (const truong of cauHinh.truong) {
      const giaTri = form[truong.name];

      if (truong.required && !String(giaTri ?? "").trim()) {
        return `${truong.label} không được để trống.`;
      }

      if (
        truong.minLength &&
        String(giaTri ?? "").trim().length < truong.minLength
      ) {
        return `${truong.label} phải có ít nhất ${truong.minLength} ký tự.`;
      }

      if (truong.maxLength && String(giaTri ?? "").length > truong.maxLength) {
        return `${truong.label} không được vượt quá ${truong.maxLength} ký tự.`;
      }
    }

    if (loai === "kich-co") {
      const ma = form.ma.trim();

      if (!/^[a-zA-Z0-9_-]+$/.test(ma)) {
        return "Mã kích cỡ chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới.";
      }
    }

    if (loai === "mau-sac") {
      const maHex = form.maHex.trim();

      if (maHex && !/^#[0-9a-fA-F]{6}$/.test(maHex)) {
        return "Mã HEX phải có định dạng #RRGGBB.";
      }
    }

    if (
      "thuTuHienThi" in form &&
      (!Number.isInteger(Number(form.thuTuHienThi)) ||
        Number(form.thuTuHienThi) < 0)
    ) {
      return "Thứ tự hiển thị phải là số nguyên không âm.";
    }

    if (loai === "danh-muc" && dangSuaId && form.danhMucChaId === dangSuaId) {
      return "Danh mục không thể là cha của chính nó.";
    }

    return "";
  }

  // =============================================
  // TẠO PAYLOAD ĐÚNG DTO BACKEND
  // =============================================

  function taoPayload() {
    if (loai === "danh-muc") {
      return {
        ten: form.ten.trim(),

        danhMucChaId: form.danhMucChaId || null,

        moTa: form.moTa.trim() || null,

        thuTuHienThi: Number(form.thuTuHienThi),
      };
    }

    if (loai === "thuong-hieu") {
      return {
        ten: form.ten.trim(),

        moTa: form.moTa.trim() || null,
      };
    }

    if (loai === "kich-co") {
      return {
        ma: form.ma.trim().toUpperCase(),

        tenHienThi: form.tenHienThi.trim(),

        thuTuHienThi: Number(form.thuTuHienThi),
      };
    }

    if (loai === "mau-sac") {
      return {
        ten: form.ten.trim(),

        maHex: form.maHex.trim() ? form.maHex.trim().toUpperCase() : null,

        thuTuHienThi: Number(form.thuTuHienThi),
      };
    }

    return {};
  }

  // =============================================
  // LƯU DỮ LIỆU
  // =============================================

  async function xuLyLuu(event) {
    event.preventDefault();

    if (dangLuu) {
      return;
    }

    setLoi("");

    setThongBao("");

    const thongBaoLoi = kiemTraForm();

    if (thongBaoLoi) {
      setLoi(thongBaoLoi);
      return;
    }

    setDangLuu(true);

    try {
      const payload = taoPayload();

      if (dangSuaId) {
        await capNhatCatalogAdmin(loai, dangSuaId, payload);

        setThongBao(`Cập nhật ${layTenLoai(loai).toLowerCase()} thành công.`);
      } else {
        await taoCatalogAdmin(loai, payload);

        setThongBao(`Tạo ${layTenLoai(loai).toLowerCase()} thành công.`);
      }

      dongForm();

      taiLai();
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangLuu(false);
    }
  }

  // =============================================
  // NGỪNG HOẠT ĐỘNG
  // =============================================

  async function xuLyNgung(item) {
    if (dangNgungId) {
      return;
    }

    const ten = item.ten || item.tenHienThi || item.ma;

    const dongY = window.confirm(
      `Bạn có chắc chắn muốn ngừng hoạt động "${ten}"?`,
    );

    if (!dongY) {
      return;
    }

    setLoi("");

    setThongBao("");

    setDangNgungId(item.id);

    try {
      await ngungCatalogAdmin(loai, item.id);

      setThongBao(`Đã ngừng hoạt động "${ten}".`);

      if (dangSuaId === item.id) {
        dongForm();
      }

      taiLai();
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangNgungId(null);
    }
  }

  // =============================================
  // TÌM KIẾM
  // =============================================

  const danhSachHienThi = danhSach.filter(function (item) {
    const tuKhoaChuan = tuKhoa.trim().toLowerCase();

    if (!tuKhoaChuan) {
      return true;
    }

    const noiDung = [item.ten, item.tenHienThi, item.ma, item.slug, item.maHex]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return noiDung.includes(tuKhoaChuan);
  });

  // =============================================
  // RENDER TRƯỜNG FORM
  // =============================================

  function renderTruong(truong) {
    const giaTri = form[truong.name] ?? "";

    // DANH MỤC CHA

    if (truong.type === "parentCategory") {
      const cacDanhMucCha = danhSach.filter(function (item) {
        return item.dangHoatDong && item.id !== dangSuaId;
      });

      return (
        <div key={truong.name}>
          <label className="mb-2 block text-xs font-semibold">
            {truong.label}
          </label>

          <select
            value={giaTri}
            onChange={function (event) {
              capNhatForm(truong.name, event.target.value);
            }}
            className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
          >
            <option value="">Không có danh mục cha</option>

            {cacDanhMucCha.map(function (item) {
              return (
                <option key={item.id} value={item.id}>
                  {item.ten}
                </option>
              );
            })}
          </select>
        </div>
      );
    }

    // TEXTAREA

    if (truong.type === "textarea") {
      return (
        <div key={truong.name} className="md:col-span-2">
          <label className="mb-2 block text-xs font-semibold">
            {truong.label}
          </label>

          <textarea
            rows={4}
            value={giaTri}
            onChange={function (event) {
              capNhatForm(truong.name, event.target.value);
            }}
            placeholder={`Nhập ${truong.label.toLowerCase()}...`}
            disabled={dangLuu}
            className="w-full resize-y border border-line px-4 py-3 text-sm outline-none focus:border-ink disabled:bg-paper"
          />
        </div>
      );
    }

    // NUMBER

    if (truong.type === "number") {
      return (
        <div key={truong.name}>
          <label className="mb-2 block text-xs font-semibold">
            {truong.label}
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={giaTri}
            onChange={function (event) {
              capNhatForm(truong.name, event.target.value);
            }}
            disabled={dangLuu}
            className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink disabled:bg-paper"
          />
        </div>
      );
    }

    // TEXT / HEX

    return (
      <div key={truong.name}>
        <label className="mb-2 block text-xs font-semibold">
          {truong.label}
          {truong.required ? " *" : ""}
        </label>

        <input
          type="text"
          required={Boolean(truong.required)}
          minLength={truong.minLength}
          maxLength={truong.maxLength}
          value={giaTri}
          onChange={function (event) {
            capNhatForm(truong.name, event.target.value);
          }}
          placeholder={truong.placeholder || ""}
          disabled={dangLuu}
          className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink disabled:bg-paper"
        />

        {truong.type === "colorText" && (
          <p className="mt-2 text-xs text-muted">
            Ví dụ: #000000, #FFFFFF, #FF0000.
          </p>
        )}
      </div>
    );
  }

  // =============================================
  // LOADING
  // =============================================

  if (!cauHinh) {
    return (
      <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        Loại dữ liệu quản trị không hợp lệ.
      </div>
    );
  }

  if (dangTai) {
    return (
      <div className="flex min-h-64 items-center justify-center border border-line bg-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-black" />

          <p className="mt-4 text-sm text-muted">Đang tải dữ liệu...</p>
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
            Admin / Catalog
          </p>

          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
            {cauHinh.tieuDe}
          </h1>

          <p className="mt-2 text-sm text-muted">{cauHinh.moTa}</p>
        </div>

        <button
          type="button"
          onClick={moFormThem}
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-ink-light"
        >
          <Plus size={16} />
          Thêm mới
        </button>
      </div>

      {/* THÔNG BÁO */}

      {loi && (
        <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-600">
          {loi}
        </div>
      )}

      {thongBao && (
        <div className="border border-green-200 bg-green-50 px-5 py-4 text-sm leading-6 text-green-700">
          {thongBao}
        </div>
      )}

      {/* =====================================
          FORM THÊM / SỬA
      ===================================== */}

      {hienForm && (
        <section className="border border-line bg-white p-5 md:p-8">
          <div className="mb-7 flex items-center justify-between border-b border-line pb-5">
            <div>
              <h2 className="text-lg font-bold">
                {dangSuaId ? "Cập nhật dữ liệu" : "Thêm dữ liệu mới"}
              </h2>

              <p className="mt-2 text-xs text-muted">
                Nhập các thông tin bên dưới.
              </p>
            </div>

            <button
              type="button"
              onClick={dongForm}
              disabled={dangLuu}
              className="flex h-9 w-9 items-center justify-center border border-line hover:border-ink disabled:opacity-40"
              aria-label="Đóng form"
            >
              <X size={17} />
            </button>
          </div>

          <form onSubmit={xuLyLuu}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {cauHinh.truong.map(renderTruong)}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={dangLuu}
                className="inline-flex items-center gap-2 bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-ink-light disabled:opacity-50"
              >
                <Save size={15} />

                {dangLuu
                  ? "Đang lưu..."
                  : dangSuaId
                    ? "Lưu thay đổi"
                    : "Tạo mới"}
              </button>

              <button
                type="button"
                onClick={dongForm}
                disabled={dangLuu}
                className="border border-line px-7 py-4 text-xs font-semibold uppercase tracking-widest hover:border-ink disabled:opacity-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 border border-line bg-white px-4 sm:max-w-md">
          <Search size={17} className="shrink-0 text-muted" />

          <input
            type="text"
            value={tuKhoa}
            onChange={function (event) {
              setTuKhoa(event.target.value);
            }}
            placeholder="Tìm theo tên hoặc mã..."
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-muted">{danhSachHienThi.length} kết quả</p>

          <button
            type="button"
            onClick={taiLai}
            title="Tải lại"
            className="flex h-10 w-10 items-center justify-center border border-line bg-white hover:border-ink"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* =====================================
          TABLE
      ===================================== */}

      <section className="overflow-hidden border border-line bg-white">
        {danhSachHienThi.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <Tags size={34} className="text-gray-300" />

            <h2 className="mt-4 text-lg font-semibold">Không có dữ liệu</h2>

            <p className="mt-2 text-sm text-muted">
              Không tìm thấy dữ liệu phù hợp hoặc danh sách đang trống.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-paper">
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                    Thông tin
                  </th>

                  {loai === "danh-muc" && (
                    <>
                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Danh mục cha
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Slug
                      </th>
                    </>
                  )}

                  {loai === "thuong-hieu" && (
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Slug
                    </th>
                  )}

                  {loai === "kich-co" && (
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Tên hiển thị
                    </th>
                  )}

                  {loai === "mau-sac" && (
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Mã HEX
                    </th>
                  )}

                  {loai !== "thuong-hieu" && (
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Thứ tự
                    </th>
                  )}

                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted">
                    Trạng thái
                  </th>

                  <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-muted">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {danhSachHienThi.map(function (item) {
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-line last:border-0 hover:bg-paper/50"
                    >
                      {/* THÔNG TIN */}

                      <td className="min-w-[180px] px-5 py-5">
                        <p className="text-sm font-semibold">
                          {item[cauHinh.tenTruong]}
                        </p>

                        {loai === "kich-co" && (
                          <p className="mt-1 text-xs text-muted">
                            Mã: {item.ma}
                          </p>
                        )}

                        {item.moTa && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted">
                            {item.moTa}
                          </p>
                        )}
                      </td>

                      {/* DANH MỤC CHA */}

                      {loai === "danh-muc" && (
                        <>
                          <td className="px-5 py-5 text-sm">
                            {item.tenDanhMucCha || "Không có"}
                          </td>

                          <td className="px-5 py-5 text-xs text-muted">
                            {item.slug}
                          </td>
                        </>
                      )}

                      {/* THƯƠNG HIỆU */}

                      {loai === "thuong-hieu" && (
                        <td className="px-5 py-5 text-xs text-muted">
                          {item.slug}
                        </td>
                      )}

                      {/* KÍCH CỠ */}

                      {loai === "kich-co" && (
                        <td className="px-5 py-5 text-sm">{item.tenHienThi}</td>
                      )}

                      {/* MÀU SẮC */}

                      {loai === "mau-sac" && (
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            {item.maHex && (
                              <span
                                className="h-5 w-5 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor: item.maHex,
                                }}
                              />
                            )}

                            <span className="text-xs text-muted">
                              {item.maHex || "Chưa có"}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* THỨ TỰ */}

                      {loai !== "thuong-hieu" && (
                        <td className="px-5 py-5 text-sm">
                          {item.thuTuHienThi ?? 0}
                        </td>
                      )}

                      {/* TRẠNG THÁI */}

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex px-3 py-2 text-[10px] font-semibold ${
                            item.dangHoatDong
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.dangHoatDong ? "ĐANG HOẠT ĐỘNG" : "ĐÃ NGỪNG"}
                        </span>
                      </td>

                      {/* THAO TÁC */}

                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="Chỉnh sửa"
                            onClick={function () {
                              moFormSua(item);
                            }}
                            className="flex h-9 w-9 items-center justify-center border border-line hover:border-ink"
                          >
                            <Pencil size={15} />
                          </button>

                          {item.dangHoatDong && (
                            <button
                              type="button"
                              title="Ngừng hoạt động"
                              disabled={dangNgungId === item.id}
                              onClick={function () {
                                xuLyNgung(item);
                              }}
                              className="flex h-9 w-9 items-center justify-center border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FOOTER NOTE */}

      <p className="text-xs leading-6 text-muted">
        Lưu ý: thao tác ngừng hoạt động không xóa dữ liệu khỏi cơ sở dữ liệu. Dữ
        liệu cũ vẫn được giữ lại để bảo toàn quan hệ với sản phẩm đã phát sinh.
      </p>
    </div>
  );
}
