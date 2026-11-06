import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  layDanhSachDiaChi,
  themDiaChi,
  capNhatDiaChi,
  datDiaChiMacDinh,
  xoaDiaChi,
} from "../../services/addressService";

import { layThongBaoLoi } from "../../utils/apiError";

const FORM_MAC_DINH = {
  tenNguoiNhan: "",
  soDienThoai: "",
  tinhThanh: "",
  quanHuyen: "",
  phuongXa: "",
  diaChiChiTiet: "",
  laMacDinh: false,
};

export default function AddressPage() {
  const [danhSachDiaChi, setDanhSachDiaChi] = useState([]);

  const [dangTai, setDangTai] = useState(true);

  const [dangGui, setDangGui] = useState(false);

  const [loi, setLoi] = useState("");

  const [thongBao, setThongBao] = useState("");

  const [dangSuaId, setDangSuaId] = useState(null);

  const [hienForm, setHienForm] = useState(false);

  const [form, setForm] = useState(FORM_MAC_DINH);

  // =============================================
  // TẢI DANH SÁCH ĐỊA CHỈ
  // =============================================

  async function taiDanhSachDiaChi() {
    setDangTai(true);

    setLoi("");

    try {
      const ketQua = await layDanhSachDiaChi();

      setDanhSachDiaChi(Array.isArray(ketQua) ? ketQua : []);
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangTai(false);
    }
  }

  useEffect(function () {
    taiDanhSachDiaChi();
  }, []);

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
  // MỞ FORM THÊM MỚI
  // =============================================

  function moFormThemMoi() {
    setDangSuaId(null);

    setForm({
      ...FORM_MAC_DINH,
      laMacDinh: danhSachDiaChi.length === 0,
    });

    setLoi("");

    setThongBao("");

    setHienForm(true);
  }

  // =============================================
  // MỞ FORM CẬP NHẬT
  // =============================================

  function moFormCapNhat(diaChi) {
    setDangSuaId(diaChi.id);

    setForm({
      tenNguoiNhan: diaChi.tenNguoiNhan || "",

      soDienThoai: diaChi.soDienThoai || "",

      tinhThanh: diaChi.tinhThanh || "",

      quanHuyen: diaChi.quanHuyen || "",

      phuongXa: diaChi.phuongXa || "",

      diaChiChiTiet: diaChi.diaChiChiTiet || "",

      laMacDinh: diaChi.laMacDinh,
    });

    setLoi("");

    setThongBao("");

    setHienForm(true);
  }

  // =============================================
  // ĐÓNG FORM
  // =============================================

  function dongForm() {
    setHienForm(false);

    setDangSuaId(null);

    setForm(FORM_MAC_DINH);
  }

  // =============================================
  // LƯU ĐỊA CHỈ
  // =============================================

  async function xuLyLuuDiaChi(event) {
    event.preventDefault();

    if (dangGui) {
      return;
    }

    setLoi("");

    setThongBao("");

    setDangGui(true);

    const thongTin = {
      tenNguoiNhan: form.tenNguoiNhan.trim(),

      soDienThoai: form.soDienThoai.trim(),

      tinhThanh: form.tinhThanh.trim(),

      quanHuyen: form.quanHuyen.trim() || null,

      phuongXa: form.phuongXa.trim(),

      diaChiChiTiet: form.diaChiChiTiet.trim(),

      laMacDinh: form.laMacDinh,
    };

    try {
      if (dangSuaId) {
        await capNhatDiaChi(dangSuaId, thongTin);

        setThongBao("Cập nhật địa chỉ thành công.");
      } else {
        await themDiaChi(thongTin);

        setThongBao("Thêm địa chỉ giao hàng thành công.");
      }

      dongForm();

      await taiDanhSachDiaChi();
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangGui(false);
    }
  }

  // =============================================
  // ĐẶT ĐỊA CHỈ MẶC ĐỊNH
  // =============================================

  async function xuLyDatMacDinh(diaChi) {
    setLoi("");

    setThongBao("");

    try {
      await datDiaChiMacDinh(diaChi.id);

      await taiDanhSachDiaChi();

      setThongBao("Đã cập nhật địa chỉ mặc định.");
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    }
  }

  // =============================================
  // XÓA ĐỊA CHỈ
  // =============================================

  async function xuLyXoa(diaChi) {
    const dongY = window.confirm(
      `Bạn có chắc chắn muốn xóa địa chỉ của ${diaChi.tenNguoiNhan}?`,
    );

    if (!dongY) {
      return;
    }

    setLoi("");

    setThongBao("");

    try {
      await xoaDiaChi(diaChi.id);

      await taiDanhSachDiaChi();

      setThongBao("Đã xóa địa chỉ giao hàng.");
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    }
  }

  // =============================================
  // LOADING
  // =============================================

  if (dangTai) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7f6f2]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
      </main>
    );
  }

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8">
        {/* BREADCRUMB */}

        <div className="mb-8 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-black">
            Trang chủ
          </Link>

          <span>/</span>

          <Link to="/gio-hang" className="hover:text-black">
            Giỏ hàng
          </Link>

          <span>/</span>

          <span className="text-black">Địa chỉ giao hàng</span>
        </div>

        {/* HEADER */}

        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-gray-200 pb-8">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Delivery information
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Địa chỉ giao hàng
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              Quản lý các địa chỉ nhận hàng của bạn.
            </p>
          </div>

          <button
            type="button"
            onClick={moFormThemMoi}
            className="bg-black px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
          >
            + Thêm địa chỉ
          </button>
        </div>

        {/* THÔNG BÁO */}

        {loi && (
          <div className="mb-5 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {loi}
          </div>
        )}

        {thongBao && (
          <div className="mb-5 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {thongBao}
          </div>
        )}

        {/* =================================
                    FORM THÊM / SỬA
                ================================= */}

        {hienForm && (
          <form
            onSubmit={xuLyLuuDiaChi}
            className="mb-10 border border-gray-200 bg-white p-6 sm:p-8"
          >
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {dangSuaId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
              </h2>

              <button
                type="button"
                onClick={dongForm}
                className="text-sm text-gray-400 hover:text-black"
              >
                Đóng ✕
              </button>
            </div>

            {/* HỌ VÀ TÊN */}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tên người nhận *
                </label>

                <input
                  type="text"
                  maxLength={150}
                  required
                  value={form.tenNguoiNhan}
                  onChange={(event) =>
                    capNhatForm("tenNguoiNhan", event.target.value)
                  }
                  placeholder="Nguyễn Văn A"
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* SỐ ĐIỆN THOẠI */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Số điện thoại *
                </label>

                <input
                  type="tel"
                  maxLength={30}
                  required
                  value={form.soDienThoai}
                  onChange={(event) =>
                    capNhatForm("soDienThoai", event.target.value)
                  }
                  placeholder="0912345678"
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* TỈNH THÀNH */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tỉnh / Thành phố *
                </label>

                <input
                  type="text"
                  maxLength={150}
                  required
                  value={form.tinhThanh}
                  onChange={(event) =>
                    capNhatForm("tinhThanh", event.target.value)
                  }
                  placeholder="Tiền Giang"
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* QUẬN HUYỆN */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Quận / Huyện
                </label>

                <input
                  type="text"
                  maxLength={150}
                  value={form.quanHuyen}
                  onChange={(event) =>
                    capNhatForm("quanHuyen", event.target.value)
                  }
                  placeholder="Thành phố Mỹ Tho"
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* PHƯỜNG XÃ */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phường / Xã *
                </label>

                <input
                  type="text"
                  maxLength={150}
                  required
                  value={form.phuongXa}
                  onChange={(event) =>
                    capNhatForm("phuongXa", event.target.value)
                  }
                  placeholder="Phường 1"
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* ĐỊA CHỈ CHI TIẾT */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Địa chỉ chi tiết *
                </label>

                <textarea
                  rows={3}
                  maxLength={300}
                  required
                  value={form.diaChiChiTiet}
                  onChange={(event) =>
                    capNhatForm("diaChiChiTiet", event.target.value)
                  }
                  placeholder="Số nhà, tên đường, tòa nhà..."
                  className="w-full resize-none border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            {/* ĐỊA CHỈ MẶC ĐỊNH */}

            <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.laMacDinh}
                onChange={(event) =>
                  capNhatForm("laMacDinh", event.target.checked)
                }
                className="h-4 w-4 accent-black"
              />
              Đặt làm địa chỉ mặc định
            </label>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={dangGui}
                className="bg-black px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {dangGui ? "Đang lưu..." : "Lưu địa chỉ"}
              </button>

              <button
                type="button"
                onClick={dongForm}
                className="border border-gray-300 px-7 py-4 text-xs font-semibold uppercase tracking-widest hover:border-black"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {/* =================================
                    DANH SÁCH ĐỊA CHỈ
                ================================= */}

        {danhSachDiaChi.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-gray-300 text-center">
            <h3 className="text-xl font-semibold">Chưa có địa chỉ giao hàng</h3>

            <p className="mt-3 text-sm text-gray-500">
              Hãy thêm địa chỉ để có thể đặt hàng.
            </p>

            <button
              type="button"
              onClick={moFormThemMoi}
              className="mt-6 bg-black px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Thêm địa chỉ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {danhSachDiaChi.map(function (diaChi) {
              return (
                <article
                  key={diaChi.id}
                  className="border border-gray-200 bg-white p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    {/* THÔNG TIN */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {diaChi.tenNguoiNhan}
                        </h3>

                        {diaChi.laMacDinh && (
                          <span className="border border-black px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                            Mặc định
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-gray-500">
                        {diaChi.soDienThoai}
                      </p>

                      <p className="mt-3 text-sm leading-7 text-gray-600">
                        {diaChi.diaChiChiTiet}, {diaChi.phuongXa},{" "}
                        {diaChi.quanHuyen && `${diaChi.quanHuyen}, `}
                        {diaChi.tinhThanh}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => moFormCapNhat(diaChi)}
                        className="text-xs font-semibold underline underline-offset-4 hover:text-gray-500"
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        onClick={() => xuLyXoa(diaChi)}
                        className="text-xs font-semibold text-red-500 underline underline-offset-4 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* ĐẶT MẶC ĐỊNH */}

                  {!diaChi.laMacDinh && (
                    <button
                      type="button"
                      onClick={() => xuLyDatMacDinh(diaChi)}
                      className="mt-6 border border-gray-300 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest transition-colors hover:border-black"
                    >
                      Đặt làm mặc định
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* QUAY LẠI CHECKOUT */}

        <div className="mt-10">
          <Link
            to="/thanh-toan"
            className="text-xs font-semibold uppercase tracking-widest text-gray-500 underline underline-offset-4 hover:text-black"
          >
            Quay lại thanh toán
          </Link>
        </div>
      </div>
    </main>
  );
}
