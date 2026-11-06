import { useState } from "react";

import { Link } from "react-router-dom";

import { useCart } from "../../contexts/CartContext";

import {
  capNhatSoLuong,
  xoaSanPhamKhoiGioHang,
  xoaTatCaGioHang,
} from "../../services/cartService";

import { dinhDangTienVietNam } from "../../utils/formatCurrency";

import { layThongBaoLoi } from "../../utils/apiError";

export default function CartPage() {
  const {
    gioHang,
    dangTaiGioHang,
    loiTaiGioHang,
    capNhatGioHang,
    taiGioHang
    } = useCart();

  const [dangXuLyId, setDangXuLyId] = useState(null);

  const [loi, setLoi] = useState("");

  const [thongBao, setThongBao] = useState("");

  // =============================================
  // CẬP NHẬT DỮ LIỆU GIỎ HÀNG
  // =============================================

  async function capNhatDuLieuSauApi(ketQua) {
    // API trả về giỏ hàng mới
    if (ketQua && Array.isArray(ketQua.items)) {
      capNhatGioHang(ketQua);
    } else {
      // Nếu API không trả body thì tải lại giỏ hàng
      await taiGioHang();
    }
  }

  // =============================================
  // CẬP NHẬT SỐ LƯỢNG
  // =============================================

  async function xuLyCapNhatSoLuong(item, soLuongMoi) {
    if (dangXuLyId !== null) {
      return;
    }

    if (soLuongMoi < 1) {
      return;
    }

    // Không cho tăng vượt tồn kho đã biết
    if (soLuongMoi > item.soLuongTon) {
      setLoi(
        `Sản phẩm "${item.tenSanPham}" chỉ còn ${item.soLuongTon} sản phẩm trong kho.`,
      );

      return;
    }

    setLoi("");

    setThongBao("");

    setDangXuLyId(item.id);

    try {
      const ketQua = await capNhatSoLuong(item.id, soLuongMoi);

      await capNhatDuLieuSauApi(ketQua);
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangXuLyId(null);
    }
  }

  // =============================================
  // XÓA MỘT SẢN PHẨM
  // =============================================

  async function xuLyXoaSanPham(item) {
    if (dangXuLyId !== null) {
      return;
    }

    setLoi("");

    setThongBao("");

    setDangXuLyId(item.id);

    try {
      const ketQua = await xoaSanPhamKhoiGioHang(item.id);

      await capNhatDuLieuSauApi(ketQua);

      setThongBao(`Đã xóa "${item.tenSanPham}" khỏi giỏ hàng.`);
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangXuLyId(null);
    }
  }

  // =============================================
  // XÓA TOÀN BỘ GIỎ HÀNG
  // =============================================

  async function xuLyXoaTatCa() {
    if (dangXuLyId !== null) {
      return;
    }

    const dongY = window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?");

    if (!dongY) {
      return;
    }

    setLoi("");

    setThongBao("");

    setDangXuLyId("tat-ca");

    try {
      const ketQua = await xoaTatCaGioHang();

      await capNhatDuLieuSauApi(ketQua);

      setThongBao("Đã xóa toàn bộ giỏ hàng.");
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangXuLyId(null);
    }
  }

  // =============================================
  // ĐANG TẢI GIỎ HÀNG
  // =============================================

  if (dangTaiGioHang) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f6f2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>

          <p className="mt-4 text-sm text-gray-500">Đang tải giỏ hàng...</p>
        </div>
      </main>
    );
  }

  // =============================================
  // LỖI TẢI GIỎ HÀNG
  // =============================================

  if (!gioHang && loiTaiGioHang) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f6f2] px-5 text-center">
        <h2 className="text-2xl font-semibold">Không thể tải giỏ hàng</h2>

        <p className="mt-3 text-sm text-gray-500">{loiTaiGioHang}</p>

        <button
          type="button"
          onClick={function () {
            taiGioHang().catch(() => {});
          }}
          className="mt-6 bg-black px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Thử tải lại
        </button>
      </main>
    );
  }

  // =============================================
  // DỮ LIỆU GIỎ HÀNG
  // =============================================

  const items = gioHang?.items || [];

  const dangCoSanPham = items.length > 0;

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
        {/* BREADCRUMB */}

        <div className="mb-8 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-black">
            Trang chủ
          </Link>

          <span>/</span>

          <span className="text-black">Giỏ hàng</span>
        </div>

        {/* TIÊU ĐỀ */}

        <div className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
            Your selection
          </p>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Giỏ hàng
            </h1>

            <p className="text-sm text-gray-500">
              {gioHang?.tongSoLuong || 0} sản phẩm
            </p>
          </div>
        </div>

        {/* THÔNG BÁO LỖI */}

        {loi && (
          <div className="mb-6 flex items-center justify-between gap-4 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            <span>{loi}</span>

            <button
              type="button"
              onClick={() => setLoi("")}
              className="shrink-0 font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* THÔNG BÁO THÀNH CÔNG */}

        {thongBao && (
          <div className="mb-6 flex items-center justify-between gap-4 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            <span>{thongBao}</span>

            <button
              type="button"
              onClick={() => setThongBao("")}
              className="shrink-0 font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* =================================
                    GIỎ HÀNG TRỐNG
                ================================= */}

        {!dangCoSanPham && (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="text-7xl font-light text-gray-200">0</div>

            <h2 className="mt-6 text-2xl font-semibold">Giỏ hàng đang trống</h2>

            <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá bộ sưu tập
              của FashionStore.
            </p>

            <Link
              to="/san-pham"
              className="mt-8 bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-gray-800"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}

        {/* =================================
                    DANH SÁCH SẢN PHẨM
                ================================= */}

        {dangCoSanPham && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* DANH SÁCH */}

            <section>
              {/* TIÊU ĐỀ CỘT */}

              <div className="mb-5 hidden grid-cols-[minmax(0,1fr)_120px_130px] gap-5 border-b border-gray-200 pb-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400 sm:grid">
                <span>Sản phẩm</span>

                <span className="text-center">Số lượng</span>

                <span className="text-right">Thành tiền</span>
              </div>

              {/* CÁC DÒNG SẢN PHẨM */}

              <div className="divide-y divide-gray-200">
                {items.map(function (item) {
                  const dangXuLy =
                    dangXuLyId === item.id || dangXuLyId === "tat-ca";

                  return (
                    <article
                      key={item.id}
                      className="grid grid-cols-1 gap-5 py-6 sm:grid-cols-[minmax(0,1fr)_120px_130px] sm:items-center"
                    >
                      {/* THÔNG TIN SẢN PHẨM */}

                      <div className="flex min-w-0 gap-4">
                        <Link
                          to={`/san-pham/${item.slug}`}
                          className="h-32 w-24 shrink-0 overflow-hidden bg-[#eae8e2] sm:h-40 sm:w-28"
                        >
                          {item.duongDanAnh ? (
                            <img
                              src={item.duongDanAnh}
                              alt={item.tenSanPham}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-col items-start">
                          {/* TÊN SẢN PHẨM */}

                          <Link
                            to={`/san-pham/${item.slug}`}
                            className="line-clamp-2 text-sm font-semibold hover:text-gray-500"
                          >
                            {item.tenSanPham}
                          </Link>

                          {/* SKU */}

                          <p className="mt-2 text-xs text-gray-400">
                            SKU: {item.sku}
                          </p>

                          {/* SIZE VÀ MÀU */}

                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                            {item.tenKichCo && (
                              <span>Size: {item.tenKichCo}</span>
                            )}

                            {item.tenMauSac && (
                              <span>Màu: {item.tenMauSac}</span>
                            )}
                          </div>

                          {/* MÀU SẮC */}

                          {item.maHex && (
                            <div className="mt-3 flex items-center gap-2">
                              <span
                                className="h-4 w-4 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor: item.maHex,
                                }}
                              />

                              <span className="text-[10px] text-gray-400">
                                {item.tenMauSac}
                              </span>
                            </div>
                          )}

                          {/* GIÁ TRÊN MOBILE */}

                          <p className="mt-4 text-sm font-semibold sm:hidden">
                            {dinhDangTienVietNam(item.giaBan)}
                          </p>

                          {/* TÌNH TRẠNG */}

                          {!item.conTheMua && (
                            <p className="mt-3 text-xs font-medium text-red-600">
                              Sản phẩm hiện không thể mua
                            </p>
                          )}

                          {/* XÓA SẢN PHẨM */}

                          <button
                            type="button"
                            disabled={dangXuLy}
                            onClick={() => xuLyXoaSanPham(item)}
                            className="mt-auto pt-4 text-xs text-gray-400 underline underline-offset-4 transition-colors hover:text-red-600 disabled:opacity-40"
                          >
                            {dangXuLy ? "Đang xử lý..." : "Xóa sản phẩm"}
                          </button>
                        </div>
                      </div>

                      {/* SỐ LƯỢNG */}

                      <div className="flex items-center justify-start sm:justify-center">
                        <div className="flex items-center border border-gray-300">
                          {/* GIẢM */}

                          <button
                            type="button"
                            disabled={dangXuLy || item.soLuong <= 1}
                            onClick={() =>
                              xuLyCapNhatSoLuong(item, item.soLuong - 1)
                            }
                            className="px-3 py-2 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            −
                          </button>

                          {/* SỐ LƯỢNG HIỆN TẠI */}

                          <span className="min-w-10 text-center text-sm">
                            {item.soLuong}
                          </span>

                          {/* TĂNG */}

                          <button
                            type="button"
                            disabled={
                              dangXuLy ||
                              !item.conTheMua ||
                              item.soLuong >= item.soLuongTon
                            }
                            onClick={() =>
                              xuLyCapNhatSoLuong(item, item.soLuong + 1)
                            }
                            className="px-3 py-2 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* THÀNH TIỀN */}

                      <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold">
                          {dinhDangTienVietNam(item.thanhTien)}
                        </p>

                        {item.giaNiemYet && item.giaNiemYet > item.giaBan && (
                          <p className="mt-1 text-xs text-gray-400 line-through">
                            {dinhDangTienVietNam(
                              item.giaNiemYet * item.soLuong,
                            )}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* =================================
                                HÀNH ĐỘNG GIỎ HÀNG
                            ================================= */}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                {/* TIẾP TỤC MUA SẮM */}

                <Link
                  to="/san-pham"
                  className="text-xs font-semibold uppercase tracking-widest text-gray-500 underline underline-offset-4 hover:text-black"
                >
                  ← Tiếp tục mua sắm
                </Link>

                {/* XÓA TOÀN BỘ */}

                <button
                  type="button"
                  disabled={dangXuLyId !== null}
                  onClick={xuLyXoaTatCa}
                  className="text-xs text-red-500 underline underline-offset-4 hover:text-red-700 disabled:opacity-40"
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </section>

            {/* =================================
                            TÓM TẮT ĐƠN HÀNG
                        ================================= */}

            <aside className="h-fit border border-gray-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Order summary
              </p>

              <h2 className="mt-3 text-2xl font-semibold">Tóm tắt giỏ hàng</h2>

              {/* THÔNG TIN */}

              <div className="mt-8 space-y-5 border-b border-gray-200 pb-6">
                {/* SỐ LƯỢNG */}

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">Số lượng</span>

                  <span className="font-medium">
                    {gioHang.tongSoLuong} sản phẩm
                  </span>
                </div>

                {/* TẠM TÍNH */}

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">Tạm tính</span>

                  <span className="font-medium">
                    {dinhDangTienVietNam(gioHang.tongTien)}
                  </span>
                </div>

                {/* PHÍ VẬN CHUYỂN */}

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>

                  <span className="font-medium">Tính tại bước thanh toán</span>
                </div>
              </div>

              {/* TỔNG CỘNG */}

              <div className="flex items-center justify-between gap-4 py-6">
                <span className="text-sm font-semibold">Tổng cộng</span>

                <span className="text-xl font-semibold">
                  {dinhDangTienVietNam(gioHang.tongTien)}
                </span>
              </div>

              {/* THANH TOÁN - PHASE 7 */}

              <div className="border-t border-gray-200 pt-6">
                <Link
                  to="/thanh-toan"
                  className="block w-full bg-black px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-gray-800"
                >
                  Tiến hành thanh toán
                </Link>

                <p className="mt-3 text-center text-xs leading-6 text-gray-400">
                  Thanh toán tiền mặt khi nhận hàng (COD).
                </p>

                <p className="mt-3 text-center text-xs leading-6 text-gray-400">
                  Chức năng địa chỉ giao hàng và đặt hàng sẽ được tích hợp ở
                  Phase 7.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
