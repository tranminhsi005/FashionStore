import { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../contexts/CartContext";

import { layDanhSachDiaChi } from "../../services/addressService";

import { taoDonHang } from "../../services/orderService";

import { dinhDangTienVietNam } from "../../utils/formatCurrency";

import { layThongBaoLoi } from "../../utils/apiError";

function taoKhoaIdempotent() {
  // Trình duyệt hiện đại hỗ trợ crypto.randomUUID()
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Dự phòng cho trình duyệt không hỗ trợ randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (kyTu) {
      const ngauNhien = Math.floor(Math.random() * 16);

      const giaTri = kyTu === "x" ? ngauNhien : (ngauNhien & 0x3) | 0x8;

      return giaTri.toString(16);
    },
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  // =============================================
  // CART CONTEXT
  // =============================================

  const { gioHang, dangTaiGioHang, taiGioHang } = useCart();

  // =============================================
  // ADDRESS STATE
  // =============================================

  const [danhSachDiaChi, setDanhSachDiaChi] = useState([]);

  const [diaChiDuocChon, setDiaChiDuocChon] = useState("");

  // =============================================
  // CHECKOUT STATE
  // =============================================

  const [ghiChuKhachHang, setGhiChuKhachHang] = useState("");

  const [dangTaiTrang, setDangTaiTrang] = useState(true);

  const [dangDatHang, setDangDatHang] = useState(false);

  const [loi, setLoi] = useState("");

  // Giữ nguyên khóa idempotent nếu khách thử đặt lại
  const khoaIdempotentRef = useRef(null);

  // =============================================
  // TẢI ĐỊA CHỈ VÀ GIỎ HÀNG
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiDuLieuCheckout() {
        setDangTaiTrang(true);

        setLoi("");

        try {
          const ketQua = await Promise.all([layDanhSachDiaChi(), taiGioHang()]);

          if (!componentConTonTai) {
            return;
          }

          const diaChis = ketQua[0] || [];

          setDanhSachDiaChi(diaChis);

          // Ưu tiên địa chỉ mặc định
          const diaChiMacDinh = diaChis.find(function (diaChi) {
            return diaChi.laMacDinh;
          });

          const diaChiDauTien = diaChiMacDinh || diaChis[0];

          setDiaChiDuocChon(diaChiDauTien?.id || "");
        } catch (error) {
          if (componentConTonTai) {
            setLoi(layThongBaoLoi(error));
          }
        } finally {
          if (componentConTonTai) {
            setDangTaiTrang(false);
          }
        }
      }

      taiDuLieuCheckout();

      return function () {
        componentConTonTai = false;
      };
    },
    [taiGioHang],
  );

  // =============================================
  // ĐỊA CHỈ ĐANG CHỌN
  // =============================================

  const diaChiHienTai = danhSachDiaChi.find(function (diaChi) {
    return diaChi.id === diaChiDuocChon;
  });

  // =============================================
  // ĐẶT HÀNG
  // =============================================

  async function xuLyDatHang(event) {
    event.preventDefault();

    if (dangDatHang) {
      return;
    }

    setLoi("");

    if (!gioHang || !gioHang.items || gioHang.items.length === 0) {
      setLoi("Giỏ hàng của bạn đang trống.");

      return;
    }

    if (!diaChiDuocChon) {
      setLoi("Vui lòng chọn địa chỉ giao hàng.");

      return;
    }

    // Không cho đặt khi có sản phẩm không thể mua
    const coSanPhamKhongTheMua = gioHang.items.some(function (item) {
      return !item.conTheMua;
    });

    if (coSanPhamKhongTheMua) {
      setLoi(
        "Giỏ hàng có sản phẩm không còn khả dụng. Vui lòng quay lại kiểm tra.",
      );

      return;
    }

    // Tạo khóa một lần cho lần checkout này
    if (!khoaIdempotentRef.current) {
      const khoaDaLuu = sessionStorage.getItem("fashionstore_checkout_key");

      khoaIdempotentRef.current = khoaDaLuu || taoKhoaIdempotent();

      sessionStorage.setItem(
        "fashionstore_checkout_key",
        khoaIdempotentRef.current,
      );
    }

    setDangDatHang(true);

    try {
      const donHang = await taoDonHang({
        diaChiGiaoHangId: diaChiDuocChon,

        phuongThucThanhToan: "cod",

        ghiChuKhachHang: ghiChuKhachHang.trim(),

        khoaIdempotent: khoaIdempotentRef.current,
      });

      // Đã tạo đơn thành công, có thể xóa khóa cũ
      sessionStorage.removeItem("fashionstore_checkout_key");

      khoaIdempotentRef.current = null;

      if (!donHang || !donHang.id) {
        throw new Error("Backend chưa trả về thông tin đơn hàng.");
      }

      // Backend đã xóa các dòng giỏ hàng khi checkout thành công.
      // Tải lại giỏ hàng để cập nhật Header và Context.
      try {
        await taiGioHang();
      } catch (error) {
        console.error("Không tải lại được giỏ hàng sau checkout:", error);
      }

      // Chuyển sang chi tiết đơn hàng
      navigate(`/don-hang/${donHang.id}`, {
        replace: true,
        state: {
          vuaDatHang: true,
        },
      });
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangDatHang(false);
    }
  }

  // =============================================
  // LOADING
  // =============================================

  if (dangTaiTrang || dangTaiGioHang) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f6f2]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
      </main>
    );
  }

  // =============================================
  // GIỎ HÀNG TRỐNG
  // =============================================

  if (!gioHang || !gioHang.items || gioHang.items.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f6f2] px-5 text-center">
        <h1 className="text-3xl font-semibold">Giỏ hàng đang trống</h1>

        <p className="mt-4 text-sm text-gray-500">
          Vui lòng chọn sản phẩm trước khi thanh toán.
        </p>

        <Link
          to="/san-pham"
          className="mt-7 bg-black px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Tiếp tục mua sắm
        </Link>
      </main>
    );
  }

  // =============================================
  // GIAO DIỆN CHECKOUT
  // =============================================

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12">
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

          <span className="text-black">Thanh toán</span>
        </div>

        {/* TITLE */}

        <div className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Secure checkout
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Thanh toán
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Kiểm tra địa chỉ giao hàng và xác nhận đơn hàng.
          </p>
        </div>

        {/* LỖI */}

        {loi && (
          <div className="mb-7 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {loi}
          </div>
        )}

        <form
          onSubmit={xuLyDatHang}
          className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          {/* =================================
                        THÔNG TIN GIAO HÀNG
                    ================================= */}

          <section>
            {/* ADDRESS HEADER */}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>

              <Link
                to="/dia-chi"
                className="text-xs font-semibold uppercase tracking-widest text-gray-500 underline underline-offset-4 hover:text-black"
              >
                Quản lý địa chỉ
              </Link>
            </div>

            {/* NO ADDRESS */}

            {danhSachDiaChi.length === 0 && (
              <div className="border border-dashed border-gray-300 bg-white p-8 text-center">
                <h3 className="font-semibold">Bạn chưa có địa chỉ giao hàng</h3>

                <p className="mt-3 text-sm text-gray-500">
                  Hãy tạo địa chỉ trước khi đặt hàng.
                </p>

                <Link
                  to="/dia-chi"
                  className="mt-6 inline-block bg-black px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white"
                >
                  Thêm địa chỉ
                </Link>
              </div>
            )}

            {/* ADDRESS LIST */}

            {danhSachDiaChi.length > 0 && (
              <div className="space-y-4">
                {danhSachDiaChi.map(function (diaChi) {
                  const dangChon = diaChiDuocChon === diaChi.id;

                  return (
                    <label
                      key={diaChi.id}
                      className={`block cursor-pointer border bg-white p-5 transition-colors sm:p-6 ${
                        dangChon
                          ? "border-black"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="diaChiGiaoHang"
                          value={diaChi.id}
                          checked={dangChon}
                          onChange={() => setDiaChiDuocChon(diaChi.id)}
                          className="mt-1 h-4 w-4 accent-black"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-semibold">
                              {diaChi.tenNguoiNhan}
                            </span>

                            {diaChi.laMacDinh && (
                              <span className="border border-gray-300 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest">
                                Mặc định
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-gray-500">
                            {diaChi.soDienThoai}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {diaChi.diaChiChiTiet}, {diaChi.phuongXa},{" "}
                            {diaChi.quanHuyen && `${diaChi.quanHuyen}, `}
                            {diaChi.tinhThanh}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* SELECTED ADDRESS */}

            {diaChiHienTai && (
              <div className="mt-5 border-l-2 border-black bg-white px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest">
                  Địa chỉ nhận hàng được chọn
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {diaChiHienTai.tenNguoiNhan} · {diaChiHienTai.soDienThoai}
                </p>
              </div>
            )}

            {/* CUSTOMER NOTE */}

            <div className="mt-10">
              <label
                htmlFor="ghiChuKhachHang"
                className="mb-3 block text-sm font-semibold"
              >
                Ghi chú đơn hàng
              </label>

              <textarea
                id="ghiChuKhachHang"
                rows={4}
                maxLength={1000}
                value={ghiChuKhachHang}
                onChange={(event) => setGhiChuKhachHang(event.target.value)}
                placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
                className="w-full resize-none border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {ghiChuKhachHang.length}/1000
              </p>
            </div>

            {/* PAYMENT METHOD */}

            <div className="mt-10">
              <h2 className="mb-5 text-xl font-semibold">
                Phương thức thanh toán
              </h2>

              <div className="border border-black bg-white p-6">
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="mt-1 h-4 w-4 accent-black"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Thanh toán khi nhận hàng (COD)
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Khách hàng thanh toán tiền mặt cho nhân viên giao hàng khi
                      nhận được đơn hàng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================
                        TÓM TẮT ĐƠN HÀNG
                    ================================= */}

          <aside className="h-fit border border-gray-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Order summary
            </p>

            <h2 className="mt-3 text-2xl font-semibold">Đơn hàng của bạn</h2>

            {/* PRODUCT LIST */}

            <div className="mt-7 max-h-[400px] space-y-5 overflow-y-auto border-b border-gray-200 pb-7">
              {gioHang.items.map(function (item) {
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-16 shrink-0 bg-[#eae8e2]">
                      {item.duongDanAnh && (
                        <img
                          src={item.duongDanAnh}
                          alt={item.tenSanPham}
                          className="h-full w-full object-cover"
                        />
                      )}

                      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                        {item.soLuong}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {item.tenSanPham}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {item.tenKichCo} / {item.tenMauSac}
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {dinhDangTienVietNam(item.thanhTien)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TOTAL */}

            <div className="mt-6 space-y-4 border-b border-gray-200 pb-6">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">Số lượng sản phẩm</span>

                <span className="font-medium">{gioHang.tongSoLuong}</span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">Tiền hàng</span>

                <span className="font-medium">
                  {dinhDangTienVietNam(gioHang.tongTien)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>

                <span className="font-medium">Tính theo Backend</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-6">
              <span className="text-sm font-semibold">Tạm tính</span>

              <span className="text-xl font-semibold">
                {dinhDangTienVietNam(gioHang.tongTien)}
              </span>
            </div>

            {/* ORDER BUTTON */}

            <button
              type="submit"
              disabled={
                dangDatHang || danhSachDiaChi.length === 0 || !diaChiDuocChon
              }
              className="w-full bg-black px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {dangDatHang ? "Đang tạo đơn hàng..." : "Xác nhận đặt hàng"}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-gray-400">
              Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng.
            </p>

            <Link
              to="/gio-hang"
              className="mt-5 block text-center text-xs font-semibold uppercase tracking-widest text-gray-500 underline underline-offset-4 hover:text-black"
            >
              Quay lại giỏ hàng
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}
