import { useEffect, useState } from "react";

import Modal from "../../common/Modal";
import Button from "../../common/Button";
import Input from "../../common/Input";

import {
  nhapKhoAdmin,
  xuatKhoAdmin,
  dieuChinhTonKhoAdmin,
} from "../../../services/adminInventoryService";

import { layThongBaoLoi } from "../../../utils/apiError";

const cacLoaiGiaoDich = [
  {
    ma: "nhap",
    ten: "Nhập kho",
  },
  {
    ma: "xuat",
    ten: "Xuất kho",
  },
  {
    ma: "dieu_chinh",
    ten: "Điều chỉnh",
  },
];

function AdminInventoryTransactionModal({
  isOpen,
  onClose,
  bienThe,
  onSuccess,
}) {
  const [loaiGiaoDich, setLoaiGiaoDich] = useState("nhap");

  const [soLuong, setSoLuong] = useState("");

  const [ghiChu, setGhiChu] = useState("");

  const [dangXuLy, setDangXuLy] = useState(false);

  const [loi, setLoi] = useState("");

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) {
      setLoaiGiaoDich("nhap");
      setSoLuong("");
      setGhiChu("");
      setLoi("");
      setDangXuLy(false);
    }
  }, [isOpen, bienThe?.bienTheSanPhamId]);

  // ===================================================
  // GỬI GIAO DỊCH
  // ===================================================

  async function xuLyGiaoDich(event) {
    event.preventDefault();

    setLoi("");

    if (!bienThe) {
      setLoi("Không tìm thấy thông tin biến thể.");
      return;
    }

    const giaTriSoLuong = Number(soLuong);

    if (!Number.isInteger(giaTriSoLuong)) {
      setLoi("Số lượng phải là số nguyên.");
      return;
    }

    if (loaiGiaoDich === "dieu_chinh") {
      if (giaTriSoLuong < 0) {
        setLoi("Số lượng tồn mới không được âm.");
        return;
      }

      if (!ghiChu.trim()) {
        setLoi("Vui lòng nhập lý do điều chỉnh.");
        return;
      }
    } else {
      if (giaTriSoLuong <= 0) {
        setLoi("Số lượng phải lớn hơn 0.");
        return;
      }
    }

    if (ghiChu.length > 500) {
      setLoi("Ghi chú không được vượt quá 500 ký tự.");
      return;
    }

    try {
      setDangXuLy(true);

      let ketQua;

      if (loaiGiaoDich === "nhap") {
        ketQua = await nhapKhoAdmin(bienThe.bienTheSanPhamId, {
          soLuong: giaTriSoLuong,
          ghiChu: ghiChu.trim(),
        });
      } else if (loaiGiaoDich === "xuat") {
        ketQua = await xuatKhoAdmin(bienThe.bienTheSanPhamId, {
          soLuong: giaTriSoLuong,
          ghiChu: ghiChu.trim(),
        });
      } else {
        ketQua = await dieuChinhTonKhoAdmin(bienThe.bienTheSanPhamId, {
          soLuongMoi: giaTriSoLuong,
          ghiChu: ghiChu.trim(),
        });
      }

      // Báo cho trang chi tiết tải lại dữ liệu
      if (onSuccess) {
        onSuccess(ketQua);
      }

      onClose();
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangXuLy(false);
    }
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thực hiện giao dịch kho"
      description="Chọn loại giao dịch và nhập thông tin số lượng."
      size="medium"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={dangXuLy}>
            Hủy
          </Button>

          <Button
            type="submit"
            form="inventoryTransactionForm"
            loading={dangXuLy}
          >
            Xác nhận giao dịch
          </Button>
        </>
      }
    >
      <form
        id="inventoryTransactionForm"
        onSubmit={xuLyGiaoDich}
        className="space-y-5"
      >
        {/* THÔNG TIN BIẾN THỂ */}

        <div className="bg-paper-dark p-4">
          <p className="text-sm font-bold">
            {bienThe?.tenSanPham || "Sản phẩm"}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span>SKU: {bienThe?.sku || "—"}</span>

            <span>
              Tồn hiện tại:{" "}
              <strong className="text-ink">{bienThe?.soLuongTon ?? 0}</strong>
            </span>
          </div>
        </div>

        {/* LOẠI GIAO DỊCH */}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Loại giao dịch
          </label>

          <div className="grid grid-cols-3 gap-2">
            {cacLoaiGiaoDich.map((item) => (
              <button
                key={item.ma}
                type="button"
                onClick={() => {
                  setLoaiGiaoDich(item.ma);
                  setSoLuong("");
                  setLoi("");
                }}
                className={`
                  rounded-control
                  border
                  px-2
                  py-3
                  text-xs
                  font-semibold
                  transition
                  ${
                    loaiGiaoDich === item.ma
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-muted hover:border-ink"
                  }
                `}
              >
                {item.ten}
              </button>
            ))}
          </div>
        </div>

        {/* SỐ LƯỢNG */}

        <Input
          label={
            loaiGiaoDich === "dieu_chinh"
              ? "Số lượng tồn mới"
              : "Số lượng giao dịch"
          }
          type="number"
          min={loaiGiaoDich === "dieu_chinh" ? 0 : 1}
          step={1}
          value={soLuong}
          onChange={(event) => setSoLuong(event.target.value)}
          placeholder={
            loaiGiaoDich === "dieu_chinh"
              ? "Nhập số lượng tồn mới"
              : "Nhập số lượng"
          }
          required
          hint={
            loaiGiaoDich === "dieu_chinh"
              ? "Hệ thống sẽ tự tính phần chênh lệch so với tồn kho hiện tại."
              : "Số lượng phải là số nguyên lớn hơn 0."
          }
        />

        {/* GHI CHÚ */}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Ghi chú{" "}
            {loaiGiaoDich === "dieu_chinh" && (
              <span className="text-danger">*</span>
            )}
          </label>

          <textarea
            value={ghiChu}
            onChange={(event) => setGhiChu(event.target.value)}
            rows={3}
            maxLength={500}
            required={loaiGiaoDich === "dieu_chinh"}
            placeholder="Nhập ghi chú hoặc lý do giao dịch..."
            className="w-full resize-none rounded-control border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
          />

          <p className="mt-1 text-right text-[11px] text-muted">
            {ghiChu.length}/500 ký tự
          </p>
        </div>

        {/* THÔNG BÁO LỖI */}

        {loi && (
          <div className="border border-danger/20 bg-red-50 p-3 text-xs leading-5 text-danger">
            {loi}
          </div>
        )}
      </form>
    </Modal>
  );
}

export default AdminInventoryTransactionModal;
