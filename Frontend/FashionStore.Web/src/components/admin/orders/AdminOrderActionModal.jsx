import { useEffect, useState } from "react";

import Modal from "../../common/Modal";
import Button from "../../common/Button";

import {
  capNhatTrangThaiDonHangAdmin,
  capNhatVanChuyenAdmin,
  adminHuyDonHang,
  xacNhanDaGiaoCODAdmin,
} from "../../../services/adminOrderService";

import { layThongBaoLoi } from "../../../utils/apiError";

// =====================================================
// CẤU HÌNH HÀNH ĐỘNG
// =====================================================

const cauHinhHanhDong = {
  xac_nhan: {
    tieuDe: "Xác nhận đơn hàng",
    moTa: "Xác nhận tiếp nhận đơn hàng từ khách hàng.",
    nutXacNhan: "Xác nhận đơn",
  },

  chuan_bi: {
    tieuDe: "Bắt đầu chuẩn bị hàng",
    moTa: "Chuyển đơn hàng sang trạng thái đang chuẩn bị.",
    nutXacNhan: "Bắt đầu chuẩn bị",
  },

  ban_giao: {
    tieuDe: "Bàn giao vận chuyển",
    moTa: "Nhập thông tin đơn vị vận chuyển trước khi bàn giao.",
    nutXacNhan: "Xác nhận bàn giao",
  },

  dang_giao: {
    tieuDe: "Cập nhật đang giao",
    moTa: "Xác nhận đơn hàng đã được đơn vị vận chuyển đưa đi giao.",
    nutXacNhan: "Cập nhật trạng thái",
  },

  giao_that_bai: {
    tieuDe: "Ghi nhận giao thất bại",
    moTa: "Ghi nhận đơn vị vận chuyển giao hàng không thành công.",
    nutXacNhan: "Xác nhận thất bại",
  },

  giao_lai: {
    tieuDe: "Bàn giao giao lại",
    moTa: "Cập nhật lại thông tin vận chuyển để giao hàng lần tiếp theo.",
    nutXacNhan: "Xác nhận giao lại",
  },

  huy: {
    tieuDe: "Hủy đơn hàng",
    moTa: "Nhập lý do để hủy đơn hàng.",
    nutXacNhan: "Xác nhận hủy đơn",
  },

  xac_nhan_da_giao: {
    tieuDe: "Xác nhận giao hàng thành công",
    moTa: "Xác nhận khách đã nhận hàng và thanh toán đầy đủ.",
    nutXacNhan: "Xác nhận đã giao",
  },
};

// =====================================================
// COMPONENT
// =====================================================

function AdminOrderActionModal({
  isOpen,
  onClose,
  donHang,
  loaiHanhDong,
  onSuccess,
}) {
  const [ghiChu, setGhiChu] = useState("");

  const [lyDoHuy, setLyDoHuy] = useState("");

  const [donViVanChuyen, setDonViVanChuyen] = useState("");

  const [maVanDon, setMaVanDon] = useState("");

  const [daThuDuTien, setDaThuDuTien] = useState(false);

  const [dangXuLy, setDangXuLy] = useState(false);

  const [loi, setLoi] = useState("");

  const cauHinh = cauHinhHanhDong[loaiHanhDong];

  const canNhapVanChuyen =
    loaiHanhDong === "ban_giao" || loaiHanhDong === "giao_lai";

  const laHuyDon = loaiHanhDong === "huy";

  const laXacNhanCOD = loaiHanhDong === "xac_nhan_da_giao";

  // ===================================================
  // RESET FORM KHI MỞ MODAL
  // ===================================================

  useEffect(() => {
    if (isOpen) {
      setGhiChu("");
      setLyDoHuy("");
      setDonViVanChuyen(donHang?.donViVanChuyen || "");
      setMaVanDon(donHang?.maVanDon || "");
      setDaThuDuTien(false);
      setLoi("");
      setDangXuLy(false);
    }
  }, [isOpen, loaiHanhDong, donHang?.id]);

  // ===================================================
  // XỬ LÝ GỬI YÊU CẦU
  // ===================================================

  async function xuLyXacNhan(event) {
    event.preventDefault();

    setLoi("");

    if (!donHang?.id) {
      setLoi("Không tìm thấy thông tin đơn hàng.");
      return;
    }

    if (laHuyDon) {
      if (lyDoHuy.trim().length < 3) {
        setLoi("Lý do hủy phải có ít nhất 3 ký tự.");
        return;
      }

      if (lyDoHuy.trim().length > 500) {
        setLoi("Lý do hủy không được vượt quá 500 ký tự.");
        return;
      }
    }

    if (canNhapVanChuyen) {
      if (!donViVanChuyen.trim()) {
        setLoi("Vui lòng nhập đơn vị vận chuyển.");
        return;
      }

      if (!maVanDon.trim()) {
        setLoi("Vui lòng nhập mã vận đơn.");
        return;
      }

      if (donViVanChuyen.trim().length > 150 || maVanDon.trim().length > 150) {
        setLoi("Thông tin vận chuyển không được vượt quá 150 ký tự.");
        return;
      }
    }

    if (laXacNhanCOD && !daThuDuTien) {
      setLoi("Bạn phải xác nhận đã thu đủ tiền từ khách hàng.");
      return;
    }

    if (ghiChu.length > 1000) {
      setLoi("Ghi chú không được vượt quá 1000 ký tự.");
      return;
    }

    try {
      setDangXuLy(true);

      let ketQua;

      // -----------------------------------------------
      // XÁC NHẬN / CHUẨN BỊ
      // -----------------------------------------------

      if (loaiHanhDong === "xac_nhan") {
        ketQua = await capNhatTrangThaiDonHangAdmin(donHang.id, {
          trangThaiMoi: "da_xac_nhan",
          ghiChu: ghiChu.trim(),
        });
      } else if (loaiHanhDong === "chuan_bi") {
        ketQua = await capNhatTrangThaiDonHangAdmin(donHang.id, {
          trangThaiMoi: "dang_chuan_bi",
          ghiChu: ghiChu.trim(),
        });
      }

      // -----------------------------------------------
      // BÀN GIAO VẬN CHUYỂN
      // -----------------------------------------------
      else if (loaiHanhDong === "ban_giao") {
        ketQua = await capNhatVanChuyenAdmin(donHang.id, {
          trangThaiMoi: "da_lay_hang",
          donViVanChuyen: donViVanChuyen.trim(),
          maVanDon: maVanDon.trim(),
          ghiChu: ghiChu.trim(),
        });
      }

      // -----------------------------------------------
      // ĐANG GIAO
      // -----------------------------------------------
      else if (loaiHanhDong === "dang_giao") {
        ketQua = await capNhatVanChuyenAdmin(donHang.id, {
          trangThaiMoi: "dang_giao",
          ghiChu: ghiChu.trim(),
        });
      }

      // -----------------------------------------------
      // GIAO THẤT BẠI
      // -----------------------------------------------
      else if (loaiHanhDong === "giao_that_bai") {
        ketQua = await capNhatVanChuyenAdmin(donHang.id, {
          trangThaiMoi: "giao_that_bai",
          ghiChu: ghiChu.trim(),
        });
      }

      // -----------------------------------------------
      // GIAO LẠI
      // -----------------------------------------------
      else if (loaiHanhDong === "giao_lai") {
        ketQua = await capNhatVanChuyenAdmin(donHang.id, {
          trangThaiMoi: "da_lay_hang",
          donViVanChuyen: donViVanChuyen.trim(),
          maVanDon: maVanDon.trim(),
          ghiChu: ghiChu.trim(),
        });
      }

      // -----------------------------------------------
      // HỦY ĐƠN
      // -----------------------------------------------
      else if (loaiHanhDong === "huy") {
        ketQua = await adminHuyDonHang(donHang.id, lyDoHuy.trim());
      }

      // -----------------------------------------------
      // XÁC NHẬN ĐÃ GIAO COD
      // -----------------------------------------------
      else if (loaiHanhDong === "xac_nhan_da_giao") {
        ketQua = await xacNhanDaGiaoCODAdmin(donHang.id, {
          daThuDuTien: true,
          ghiChu: ghiChu.trim(),
        });
      }

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

  if (!cauHinh) {
    return null;
  }

  // ===================================================
  // GIAO DIỆN
  // ===================================================

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cauHinh.tieuDe}
      description={cauHinh.moTa}
      size="medium"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={dangXuLy}>
            Đóng
          </Button>

          <Button
            type="submit"
            form="adminOrderActionForm"
            variant={laHuyDon ? "danger" : "primary"}
            loading={dangXuLy}
          >
            {cauHinh.nutXacNhan}
          </Button>
        </>
      }
    >
      <form
        id="adminOrderActionForm"
        onSubmit={xuLyXacNhan}
        className="space-y-5"
      >
        {/* THÔNG TIN ĐƠN HÀNG */}

        <div className="bg-paper-dark p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Mã đơn hàng
          </p>

          <p className="mt-2 text-sm font-bold">{donHang?.maDonHang}</p>

          <p className="mt-2 text-xs text-muted">
            Khách hàng: {donHang?.tenKhachHang}
          </p>
        </div>

        {/* LÝ DO HỦY */}

        {laHuyDon && (
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Lý do hủy đơn hàng
            </label>

            <textarea
              value={lyDoHuy}
              onChange={(event) => setLyDoHuy(event.target.value)}
              rows={4}
              minLength={3}
              maxLength={500}
              required
              placeholder="Nhập lý do hủy đơn..."
              className="w-full resize-none rounded-control border border-line bg-white px-4 py-3 text-sm outline-none focus:border-danger"
            />

            <p className="mt-1 text-right text-[11px] text-muted">
              {lyDoHuy.length}/500 ký tự
            </p>
          </div>
        )}

        {/* THÔNG TIN VẬN CHUYỂN */}

        {canNhapVanChuyen && (
          <>
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Đơn vị vận chuyển
                <span className="ml-1 text-danger">*</span>
              </label>

              <input
                type="text"
                value={donViVanChuyen}
                onChange={(event) => setDonViVanChuyen(event.target.value)}
                maxLength={150}
                required
                placeholder="Ví dụ: Giao Hàng Tiết Kiệm"
                className="w-full rounded-control border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Mã vận đơn
                <span className="ml-1 text-danger">*</span>
              </label>

              <input
                type="text"
                value={maVanDon}
                onChange={(event) => setMaVanDon(event.target.value)}
                maxLength={150}
                required
                placeholder="Nhập mã vận đơn..."
                className="w-full rounded-control border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
          </>
        )}

        {/* XÁC NHẬN THU COD */}

        {laXacNhanCOD && (
          <div className="border border-amber-200 bg-amber-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={daThuDuTien}
                onChange={(event) => setDaThuDuTien(event.target.checked)}
                className="mt-1 h-4 w-4 accent-black"
              />

              <span className="text-sm leading-6">
                Tôi xác nhận khách hàng đã nhận đủ hàng và đã thanh toán đầy đủ
                số tiền COD của đơn hàng.
              </span>
            </label>
          </div>
        )}

        {/* GHI CHÚ CHUNG */}

        {!laHuyDon && (
          <div>
            <label className="mb-2 block text-sm font-semibold">Ghi chú</label>

            <textarea
              value={ghiChu}
              onChange={(event) => setGhiChu(event.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Ghi chú cho giao dịch..."
              className="w-full resize-none rounded-control border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
            />

            <p className="mt-1 text-right text-[11px] text-muted">
              {ghiChu.length}/1000 ký tự
            </p>
          </div>
        )}

        {/* LỖI */}

        {loi && (
          <div className="border border-danger/20 bg-red-50 p-3 text-sm leading-6 text-danger">
            {loi}
          </div>
        )}
      </form>
    </Modal>
  );
}

export default AdminOrderActionModal;
