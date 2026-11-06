import { useState } from "react";

import { huyDonHang } from "../../services/orderService";

import { layThongBaoLoi } from "../../utils/apiError";

export default function CancelOrderSection({ donHangId, onHuyThanhCong }) {
  const [hienForm, setHienForm] = useState(false);

  const [lyDoHuy, setLyDoHuy] = useState("");

  const [dangHuy, setDangHuy] = useState(false);

  const [loi, setLoi] = useState("");

  // =============================================
  // XỬ LÝ HỦY ĐƠN
  // =============================================

  async function xuLyHuyDon(event) {
    event.preventDefault();

    if (dangHuy) {
      return;
    }

    const lyDo = lyDoHuy.trim();

    // Kiểm tra lý do
    if (lyDo.length < 3) {
      setLoi("Lý do hủy phải có ít nhất 3 ký tự.");
      return;
    }

    if (lyDo.length > 500) {
      setLoi("Lý do hủy không được vượt quá 500 ký tự.");
      return;
    }

    setLoi("");

    setDangHuy(true);

    try {
      // Gọi API hủy đơn hàng
      await huyDonHang(donHangId, lyDo);

      // Đóng form
      setHienForm(false);

      setLyDoHuy("");

      // Thông báo cho trang cha tải lại đơn hàng
      if (onHuyThanhCong) {
        onHuyThanhCong();
      }
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangHuy(false);
    }
  }

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <section className="mt-8 border border-red-200 bg-white p-6 sm:p-8">
      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            Order cancellation
          </p>

          <h2 className="mt-3 text-xl font-semibold text-gray-900">
            Hủy đơn hàng
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Bạn có thể yêu cầu hủy đơn hàng khi đơn vẫn đang trong giai đoạn chờ
            xác nhận hoặc đã xác nhận.
          </p>
        </div>

        {!hienForm && (
          <button
            type="button"
            onClick={function () {
              setLoi("");
              setHienForm(true);
            }}
            className="border border-red-300 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-red-600 transition-colors hover:bg-red-50"
          >
            Yêu cầu hủy đơn
          </button>
        )}
      </div>

      {/* THÔNG BÁO LỖI */}

      {loi && (
        <div className="mt-5 border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-600">
          {loi}
        </div>
      )}

      {/* FORM HỦY ĐƠN */}

      {hienForm && (
        <form onSubmit={xuLyHuyDon} className="mt-7">
          <label className="mb-3 block text-sm font-semibold">
            Vui lòng cho biết lý do hủy đơn hàng
          </label>

          <textarea
            value={lyDoHuy}
            onChange={function (event) {
              setLyDoHuy(event.target.value);
              setLoi("");
            }}
            rows={4}
            minLength={3}
            maxLength={500}
            required
            disabled={dangHuy}
            placeholder="Ví dụ: Tôi muốn thay đổi sản phẩm hoặc địa chỉ giao hàng..."
            className="w-full resize-none border border-gray-300 bg-transparent p-4 text-sm leading-6 outline-none transition-colors focus:border-black disabled:bg-gray-100"
          />

          <div className="mt-2 text-right text-xs text-gray-400">
            {lyDoHuy.length}/500 ký tự
          </div>

          {/* BUTTONS */}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={dangHuy}
              className="bg-red-600 px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {dangHuy ? "Đang xử lý..." : "Xác nhận hủy đơn"}
            </button>

            <button
              type="button"
              disabled={dangHuy}
              onClick={function () {
                setHienForm(false);
                setLoi("");
              }}
              className="border border-gray-300 px-7 py-4 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-black disabled:opacity-50"
            >
              Đóng
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
