import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

import {
  layChiTietSanPhamAdmin,
  layDanhSachDanhMucAdmin,
  layDanhSachThuongHieuAdmin,
  layDanhSachKichCoAdmin,
  layDanhSachMauSacAdmin,
  taoSanPhamAdmin,
  capNhatSanPhamAdmin,
} from "../../../services/adminProductService";

import { layThongBaoLoi } from "../../../utils/apiError";

// =============================================
// FORM SẢN PHẨM MẶC ĐỊNH
// =============================================

const FORM_SAN_PHAM_MAC_DINH = {
  ten: "",
  danhMucId: "",
  thuongHieuId: "",
  moTa: "",
  chatLieu: "",
  doiTuong: "",
  noiBat: false,
};

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
// COMPONENT
// =============================================

export default function AdminProductFormPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const laChinhSua = Boolean(id);

  // =============================================
  // DỮ LIỆU DANH MỤC
  // =============================================

  const [danhMucs, setDanhMucs] = useState([]);

  const [thuongHieus, setThuongHieus] = useState([]);

  const [kichCos, setKichCos] = useState([]);

  const [mauSacs, setMauSacs] = useState([]);

  // =============================================
  // FORM
  // =============================================

  const [form, setForm] = useState(FORM_SAN_PHAM_MAC_DINH);

  const [bienThes, setBienThes] = useState([taoBienTheMacDinh()]);

  // =============================================
  // TRẠNG THÁI
  // =============================================

  const [dangTai, setDangTai] = useState(true);

  const [dangLuu, setDangLuu] = useState(false);

  const [loi, setLoi] = useState("");

  // =============================================
  // TẢI DỮ LIỆU BAN ĐẦU
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiDuLieu() {
        setDangTai(true);

        setLoi("");

        try {
          const ketQua = await Promise.all([
            layDanhSachDanhMucAdmin(),
            layDanhSachThuongHieuAdmin(),
            layDanhSachKichCoAdmin(),
            layDanhSachMauSacAdmin(),

            laChinhSua ? layChiTietSanPhamAdmin(id) : Promise.resolve(null),
          ]);

          if (!componentConTonTai) {
            return;
          }

          const [
            danhSachDanhMuc,
            danhSachThuongHieu,
            danhSachKichCo,
            danhSachMauSac,
            sanPham,
          ] = ketQua;

          setDanhMucs(
            Array.isArray(danhSachDanhMuc)
              ? danhSachDanhMuc.filter(function (item) {
                  return item.dangHoatDong !== false;
                })
              : [],
          );

          setThuongHieus(
            Array.isArray(danhSachThuongHieu)
              ? danhSachThuongHieu.filter(function (item) {
                  return item.dangHoatDong === true;
                })
              : [],
          );

          setKichCos(
            Array.isArray(danhSachKichCo)
              ? danhSachKichCo.filter(function (item) {
                  return item.dangHoatDong === true;
                })
              : [],
          );

          setMauSacs(
            Array.isArray(danhSachMauSac)
              ? danhSachMauSac.filter(function (item) {
                  return item.dangHoatDong === true;
                })
              : [],
          );

          // Nếu đang chỉnh sửa, đổ dữ liệu sản phẩm lên form.
          if (laChinhSua && sanPham) {
            setForm({
              ten: sanPham.ten || "",
              danhMucId: sanPham.danhMucId || "",
              thuongHieuId: sanPham.thuongHieuId || "",
              moTa: sanPham.moTa || "",
              chatLieu: sanPham.chatLieu || "",
              doiTuong: sanPham.doiTuong || "",
              noiBat: Boolean(sanPham.noiBat),
            });
          }
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

      taiDuLieu();

      return function () {
        componentConTonTai = false;
      };
    },
    [id, laChinhSua],
  );

  // =============================================
  // CẬP NHẬT FORM SẢN PHẨM
  // =============================================

  function capNhatForm(tenTruong, giaTri) {
    setForm(function (formCu) {
      return {
        ...formCu,
        [tenTruong]: giaTri,
      };
    });
  }

  // =============================================
  // CẬP NHẬT MỘT BIẾN THỂ
  // =============================================

  function capNhatBienThe(index, tenTruong, giaTri) {
    setBienThes(function (danhSachCu) {
      return danhSachCu.map(function (item, viTri) {
        if (viTri !== index) {
          return item;
        }

        return {
          ...item,
          [tenTruong]: giaTri,
        };
      });
    });
  }

  // =============================================
  // THÊM DÒNG BIẾN THỂ
  // =============================================

  function themDongBienThe() {
    setBienThes(function (danhSachCu) {
      return [...danhSachCu, taoBienTheMacDinh()];
    });
  }

  // =============================================
  // XÓA DÒNG BIẾN THỂ
  // =============================================

  function xoaDongBienThe(index) {
    setBienThes(function (danhSachCu) {
      if (danhSachCu.length <= 1) {
        return danhSachCu;
      }

      return danhSachCu.filter(function (_, viTri) {
        return viTri !== index;
      });
    });
  }

  // =============================================
  // KIỂM TRA FORM
  // =============================================

  function kiemTraDuLieu() {
    const ten = form.ten.trim();

    if (ten.length < 2 || ten.length > 250) {
      return "Tên sản phẩm phải từ 2 đến 250 ký tự.";
    }

    if (!form.danhMucId) {
      return "Vui lòng chọn danh mục sản phẩm.";
    }

    if (form.chatLieu.trim().length > 200) {
      return "Chất liệu không được vượt quá 200 ký tự.";
    }

    if (laChinhSua) {
      return "";
    }

    if (bienThes.length === 0) {
      return "Sản phẩm phải có ít nhất một biến thể.";
    }

    const danhSachSku = new Set();

    const danhSachToHop = new Set();

    for (let i = 0; i < bienThes.length; i++) {
      const bienThe = bienThes[i];

      const sku = bienThe.sku.trim();

      if (!sku) {
        return `Biến thể ${i + 1}: SKU không được để trống.`;
      }

      if (sku.length > 100) {
        return `Biến thể ${i + 1}: SKU không được vượt quá 100 ký tự.`;
      }

      const skuChuanHoa = sku.toLowerCase();

      if (danhSachSku.has(skuChuanHoa)) {
        return `SKU "${sku}" đang bị trùng trong form.`;
      }

      danhSachSku.add(skuChuanHoa);

      if (
        bienThe.giaBan === "" ||
        !Number.isFinite(Number(bienThe.giaBan)) ||
        Number(bienThe.giaBan) < 0
      ) {
        return `Biến thể ${i + 1}: Giá bán không hợp lệ.`;
      }

      if (
        bienThe.giaNiemYet !== "" &&
        (!Number.isFinite(Number(bienThe.giaNiemYet)) ||
          Number(bienThe.giaNiemYet) < Number(bienThe.giaBan))
      ) {
        return `Biến thể ${i + 1}: Giá niêm yết phải lớn hơn hoặc bằng giá bán.`;
      }

      const soLuongTon = Number(bienThe.soLuongTon);

      if (!Number.isInteger(soLuongTon) || soLuongTon < 0) {
        return `Biến thể ${i + 1}: Số lượng tồn phải là số nguyên không âm.`;
      }

      const toHop = `${bienThe.kichCoId || "null"}_${bienThe.mauSacId || "null"}`;

      if (danhSachToHop.has(toHop)) {
        return `Biến thể ${i + 1}: Tổ hợp kích cỡ và màu sắc đang bị trùng.`;
      }

      danhSachToHop.add(toHop);
    }

    return "";
  }

  // =============================================
  // LƯU SẢN PHẨM
  // =============================================

  async function xuLyLuuSanPham(event) {
    event.preventDefault();

    if (dangLuu) {
      return;
    }

    setLoi("");

    const thongBaoLoi = kiemTraDuLieu();

    if (thongBaoLoi) {
      setLoi(thongBaoLoi);
      return;
    }

    const thongTinCoBan = {
      ten: form.ten.trim(),
      danhMucId: form.danhMucId,
      thuongHieuId: form.thuongHieuId || null,
      moTa: form.moTa.trim() || null,
      chatLieu: form.chatLieu.trim() || null,
      doiTuong: form.doiTuong || null,
      noiBat: form.noiBat,
    };

    setDangLuu(true);

    try {
      let ketQua;

      if (laChinhSua) {
        // DTO cập nhật không nhận danh sách biến thể.
        ketQua = await capNhatSanPhamAdmin(id, thongTinCoBan);
      } else {
        // Tạo sản phẩm phải gửi ít nhất một biến thể.
        const danhSachBienThe = bienThes.map(function (item) {
          return {
            kichCoId: item.kichCoId || null,
            mauSacId: item.mauSacId || null,
            sku: item.sku.trim(),
            giaBan: Number(item.giaBan),
            giaNiemYet: item.giaNiemYet === "" ? null : Number(item.giaNiemYet),
            soLuongTon: Number(item.soLuongTon),
          };
        });

        ketQua = await taoSanPhamAdmin({
          ...thongTinCoBan,
          bienThes: danhSachBienThe,
        });
      }

      const sanPhamId = ketQua?.id || id;

      if (!sanPhamId) {
        navigate("/admin-preview/san-pham", {
          replace: true,
        });

        return;
      }

      navigate(`/admin-preview/san-pham/${sanPhamId}`, {
        replace: true,
      });
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangLuu(false);
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

          <p className="mt-4 text-sm text-muted">Đang tải dữ liệu form...</p>
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

      <div>
        <Link
          to="/admin-preview/san-pham"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft size={15} />
          Quay lại danh sách sản phẩm
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Admin / Products / {laChinhSua ? "Edit" : "Create"}
        </p>

        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
          {laChinhSua ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h1>

        <p className="mt-2 text-sm text-muted">
          {laChinhSua
            ? "Cập nhật thông tin cơ bản của sản phẩm."
            : "Tạo sản phẩm và khai báo các biến thể ban đầu."}
        </p>
      </div>

      {/* ERROR */}

      {loi && (
        <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-600">
          {loi}
        </div>
      )}

      <form onSubmit={xuLyLuuSanPham} className="space-y-7">
        {/* =====================================
            THÔNG TIN CƠ BẢN
        ===================================== */}

        <section className="border border-line bg-white p-5 md:p-8">
          <div className="mb-7 border-b border-line pb-5">
            <h2 className="text-lg font-bold">Thông tin sản phẩm</h2>

            <p className="mt-2 text-xs text-muted">
              Nhập tên, mô tả và thông tin phân loại sản phẩm.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* TÊN */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold">
                Tên sản phẩm *
              </label>

              <input
                type="text"
                required
                minLength={2}
                maxLength={250}
                value={form.ten}
                onChange={function (event) {
                  capNhatForm("ten", event.target.value);
                }}
                placeholder="Ví dụ: Áo thun oversize basic"
                className="w-full border border-line bg-transparent px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>

            {/* DANH MỤC */}

            <div>
              <label className="mb-2 block text-xs font-semibold">
                Danh mục *
              </label>

              <select
                required
                value={form.danhMucId}
                onChange={function (event) {
                  capNhatForm("danhMucId", event.target.value);
                }}
                className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              >
                <option value="">-- Chọn danh mục --</option>

                {danhMucs.map(function (item) {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.ten}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* THƯƠNG HIỆU */}

            <div>
              <label className="mb-2 block text-xs font-semibold">
                Thương hiệu
              </label>

              <select
                value={form.thuongHieuId}
                onChange={function (event) {
                  capNhatForm("thuongHieuId", event.target.value);
                }}
                className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              >
                <option value="">-- Không chọn thương hiệu --</option>

                {thuongHieus.map(function (item) {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.ten}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* CHẤT LIỆU */}

            <div>
              <label className="mb-2 block text-xs font-semibold">
                Chất liệu
              </label>

              <input
                type="text"
                maxLength={200}
                value={form.chatLieu}
                onChange={function (event) {
                  capNhatForm("chatLieu", event.target.value);
                }}
                placeholder="Ví dụ: Cotton 100%"
                className="w-full border border-line bg-transparent px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>

            {/* ĐỐI TƯỢNG */}

            <div>
              <label className="mb-2 block text-xs font-semibold">
                Đối tượng
              </label>

              <select
                value={form.doiTuong}
                onChange={function (event) {
                  capNhatForm("doiTuong", event.target.value);
                }}
                className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              >
                <option value="">-- Chưa xác định --</option>
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
                <option value="unisex">Unisex</option>
                <option value="tre_em">Trẻ em</option>
                <option value="khac">Khác</option>
              </select>
            </div>

            {/* MÔ TẢ */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold">
                Mô tả sản phẩm
              </label>

              <textarea
                rows={5}
                value={form.moTa}
                onChange={function (event) {
                  capNhatForm("moTa", event.target.value);
                }}
                placeholder="Mô tả chi tiết sản phẩm..."
                className="w-full resize-y border border-line bg-transparent px-4 py-3 text-sm leading-6 outline-none focus:border-ink"
              />
            </div>

            {/* NỔI BẬT */}

            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.noiBat}
                  onChange={function (event) {
                    capNhatForm("noiBat", event.target.checked);
                  }}
                  className="h-4 w-4 accent-black"
                />

                <span>Đánh dấu sản phẩm nổi bật</span>
              </label>
            </div>
          </div>
        </section>

        {/* =====================================
            BIẾN THỂ BAN ĐẦU
            Chỉ hiện khi tạo mới
        ===================================== */}

        {!laChinhSua && (
          <section className="border border-line bg-white p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
              <div>
                <h2 className="text-lg font-bold">Biến thể sản phẩm</h2>

                <p className="mt-2 text-xs text-muted">
                  Sản phẩm phải có ít nhất một biến thể.
                </p>
              </div>

              <button
                type="button"
                onClick={themDongBienThe}
                className="inline-flex items-center gap-2 border border-ink px-4 py-3 text-xs font-semibold transition hover:bg-ink hover:text-white"
              >
                <Plus size={15} />
                Thêm biến thể
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {bienThes.map(function (item, index) {
                return (
                  <div
                    key={index}
                    className="border border-line bg-paper/40 p-5"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-sm font-bold">
                        Biến thể {index + 1}
                      </h3>

                      <button
                        type="button"
                        disabled={bienThes.length <= 1}
                        onClick={function () {
                          xoaDongBienThe(index);
                        }}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={15} />
                        Xóa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {/* SIZE */}

                      <div>
                        <label className="mb-2 block text-xs font-semibold">
                          Kích cỡ
                        </label>

                        <select
                          value={item.kichCoId}
                          onChange={function (event) {
                            capNhatBienThe(
                              index,
                              "kichCoId",
                              event.target.value,
                            );
                          }}
                          className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                        >
                          <option value="">Không chọn</option>

                          {kichCos.map(function (kichCo) {
                            return (
                              <option key={kichCo.id} value={kichCo.id}>
                                {kichCo.tenHienThi}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* COLOR */}

                      <div>
                        <label className="mb-2 block text-xs font-semibold">
                          Màu sắc
                        </label>

                        <select
                          value={item.mauSacId}
                          onChange={function (event) {
                            capNhatBienThe(
                              index,
                              "mauSacId",
                              event.target.value,
                            );
                          }}
                          className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                        >
                          <option value="">Không chọn</option>

                          {mauSacs.map(function (mauSac) {
                            return (
                              <option key={mauSac.id} value={mauSac.id}>
                                {mauSac.ten}
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
                          type="text"
                          required
                          maxLength={100}
                          value={item.sku}
                          onChange={function (event) {
                            capNhatBienThe(index, "sku", event.target.value);
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
                          value={item.giaBan}
                          onChange={function (event) {
                            capNhatBienThe(index, "giaBan", event.target.value);
                          }}
                          placeholder="199000"
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
                          value={item.giaNiemYet}
                          onChange={function (event) {
                            capNhatBienThe(
                              index,
                              "giaNiemYet",
                              event.target.value,
                            );
                          }}
                          placeholder="299000"
                          className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                        />
                      </div>

                      {/* TỒN BAN ĐẦU */}

                      <div>
                        <label className="mb-2 block text-xs font-semibold">
                          Tồn kho ban đầu *
                        </label>

                        <input
                          type="number"
                          required
                          min="0"
                          step="1"
                          value={item.soLuongTon}
                          onChange={function (event) {
                            capNhatBienThe(
                              index,
                              "soLuongTon",
                              event.target.value,
                            );
                          }}
                          className="w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-ink"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-xs leading-6 text-muted">
              SKU phải duy nhất. Tổ hợp kích cỡ và màu sắc không được trùng
              trong cùng sản phẩm. Tồn kho ban đầu sẽ được backend ghi nhận vào
              lịch sử kho. Sau khi tạo sản phẩm, việc nhập, xuất và điều chỉnh
              tồn kho sẽ thực hiện trong module Tồn kho.
            </p>
          </section>
        )}

        {/* =====================================
            THÔNG TIN KHI CHỈNH SỬA
        ===================================== */}

        {laChinhSua && (
          <div className="border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-800">
            Form này chỉ cập nhật thông tin chung của sản phẩm. Để thêm, sửa
            hoặc ngừng kinh doanh biến thể, hãy lưu thông tin rồi vào trang chi
            tiết sản phẩm.
          </div>
        )}

        {/* =====================================
            BUTTON
        ===================================== */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/admin-preview/san-pham"
            className="border border-line bg-white px-6 py-4 text-xs font-semibold uppercase tracking-widest transition hover:border-ink"
          >
            Hủy
          </Link>

          <button
            type="submit"
            disabled={dangLuu}
            className="inline-flex items-center gap-2 bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-ink-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />

            {dangLuu
              ? "Đang lưu..."
              : laChinhSua
                ? "Lưu thay đổi"
                : "Tạo sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
