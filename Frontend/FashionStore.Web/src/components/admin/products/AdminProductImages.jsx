import { useEffect, useState } from "react";

import { ImagePlus, Star, Trash2, RefreshCw, Upload } from "lucide-react";

import {
  layDanhSachAnhAdmin,
  uploadAnhSanPhamAdmin,
  datAnhChinhAdmin,
  xoaAnhSanPhamAdmin,
} from "../../../services/adminImageService";

import { layThongBaoLoi } from "../../../utils/apiError";

// =============================================
// CẤU HÌNH FILE ẢNH
// =============================================

const DUNG_LUONG_TOI_DA = 5 * 1024 * 1024;

const CAC_LOAI_ANH = ["image/jpeg", "image/png", "image/webp"];

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

  return giaTri.toLocaleDateString("vi-VN");
}

// =============================================
// ĐỊNH DẠNG DUNG LƯỢNG
// =============================================

function dinhDangDungLuong(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// =============================================
// COMPONENT
// =============================================

export default function AdminProductImages({ sanPhamId }) {
  // =============================================
  // DANH SÁCH ẢNH
  // =============================================

  const [danhSachAnh, setDanhSachAnh] = useState([]);

  // =============================================
  // FORM UPLOAD
  // =============================================

  const [file, setFile] = useState(null);

  const [moTaAnh, setMoTaAnh] = useState("");

  const [laAnhChinh, setLaAnhChinh] = useState(false);

  const [thuTuHienThi, setThuTuHienThi] = useState("0");

  // =============================================
  // PREVIEW
  // =============================================

  const [anhXemTruoc, setAnhXemTruoc] = useState("");

  // =============================================
  // TRẠNG THÁI
  // =============================================

  const [dangTai, setDangTai] = useState(true);

  const [dangUpload, setDangUpload] = useState(false);

  const [dangDatAnhChinhId, setDangDatAnhChinhId] = useState(null);

  const [dangXoaId, setDangXoaId] = useState(null);

  const [loi, setLoi] = useState("");

  const [thongBao, setThongBao] = useState("");

  const [lanTaiLai, setLanTaiLai] = useState(0);

  // =============================================
  // TẠO URL XEM TRƯỚC
  // =============================================

  useEffect(
    function () {
      if (!file) {
        setAnhXemTruoc("");
        return;
      }

      const url = URL.createObjectURL(file);

      setAnhXemTruoc(url);

      return function () {
        URL.revokeObjectURL(url);
      };
    },
    [file],
  );

  // =============================================
  // TẢI DANH SÁCH ẢNH
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiDanhSachAnh() {
        setDangTai(true);

        setLoi("");

        try {
          const ketQua = await layDanhSachAnhAdmin(sanPhamId);

          if (!componentConTonTai) {
            return;
          }

          setDanhSachAnh(Array.isArray(ketQua) ? ketQua : []);
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

      taiDanhSachAnh();

      return function () {
        componentConTonTai = false;
      };
    },
    [sanPhamId, lanTaiLai],
  );

  // =============================================
  // TẢI LẠI DANH SÁCH
  // =============================================

  function taiLaiDanhSach() {
    setLanTaiLai(function (cu) {
      return cu + 1;
    });
  }

  // =============================================
  // CHỌN FILE
  // =============================================

  function xuLyChonFile(event) {
    const fileMoi = event.target.files?.[0];

    setLoi("");
    setThongBao("");

    if (!fileMoi) {
      setFile(null);
      return;
    }

    if (!CAC_LOAI_ANH.includes(fileMoi.type)) {
      setFile(null);
      event.target.value = "";

      setLoi("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP.");

      return;
    }

    if (fileMoi.size > DUNG_LUONG_TOI_DA) {
      setFile(null);
      event.target.value = "";

      setLoi("Dung lượng ảnh không được vượt quá 5 MB.");

      return;
    }

    setFile(fileMoi);
  }

  // =============================================
  // RESET FORM
  // =============================================

  function resetForm() {
    setFile(null);
    setMoTaAnh("");
    setLaAnhChinh(false);
    setThuTuHienThi("0");

    const inputFile = document.getElementById("admin-product-image-file");

    if (inputFile) {
      inputFile.value = "";
    }
  }

  // =============================================
  // UPLOAD ẢNH
  // =============================================

  async function xuLyUploadAnh(event) {
    event.preventDefault();

    if (dangUpload) {
      return;
    }

    if (!file) {
      setLoi("Vui lòng chọn ảnh cần upload.");
      return;
    }

    if (moTaAnh.trim().length > 200) {
      setLoi("Mô tả ảnh không được vượt quá 200 ký tự.");
      return;
    }

    const thuTu = Number(thuTuHienThi);

    if (!Number.isInteger(thuTu) || thuTu < 0 || thuTu > 1000) {
      setLoi("Thứ tự hiển thị phải từ 0 đến 1000.");
      return;
    }

    setLoi("");
    setThongBao("");
    setDangUpload(true);

    try {
      await uploadAnhSanPhamAdmin(sanPhamId, {
        file: file,
        moTaAnh: moTaAnh.trim(),
        laAnhChinh: laAnhChinh,
        thuTuHienThi: thuTu,
      });

      setThongBao("Upload ảnh sản phẩm thành công.");

      resetForm();

      taiLaiDanhSach();
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangUpload(false);
    }
  }

  // =============================================
  // ĐẶT ẢNH CHÍNH
  // =============================================

  async function xuLyDatAnhChinh(anh) {
    if (dangDatAnhChinhId || dangXoaId) {
      return;
    }

    setLoi("");
    setThongBao("");
    setDangDatAnhChinhId(anh.id);

    try {
      await datAnhChinhAdmin(anh.id);

      setThongBao("Đã cập nhật ảnh chính sản phẩm.");

      taiLaiDanhSach();
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangDatAnhChinhId(null);
    }
  }

  // =============================================
  // XÓA ẢNH
  // =============================================

  async function xuLyXoaAnh(anh) {
    if (dangXoaId || dangDatAnhChinhId) {
      return;
    }

    const dongY = window.confirm(
      `Bạn có chắc chắn muốn xóa hình ảnh này${
        anh.laAnhChinh ? " (đang là ảnh chính)" : ""
      }?`,
    );

    if (!dongY) {
      return;
    }

    setLoi("");
    setThongBao("");
    setDangXoaId(anh.id);

    try {
      await xoaAnhSanPhamAdmin(anh.id);

      setThongBao(
        anh.laAnhChinh
          ? "Đã xóa ảnh chính. Backend sẽ tự chọn ảnh thay thế nếu còn ảnh khác."
          : "Đã xóa hình ảnh sản phẩm.",
      );

      taiLaiDanhSach();
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangXoaId(null);
    }
  }

  // =============================================
  // LOADING
  // =============================================

  if (dangTai) {
    return (
      <section className="border border-line bg-white p-6 md:p-8">
        <div className="flex min-h-40 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-black" />

            <p className="mt-4 text-sm text-muted">
              Đang tải hình ảnh sản phẩm...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <section className="border border-line bg-white p-5 md:p-8">
      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Product media
          </p>

          <h2 className="mt-2 text-xl font-bold">Hình ảnh sản phẩm</h2>

          <p className="mt-2 text-xs text-muted">
            {danhSachAnh.length} hình ảnh
          </p>
        </div>

        <button
          type="button"
          onClick={taiLaiDanhSach}
          className="inline-flex items-center gap-2 border border-line px-4 py-3 text-xs font-semibold transition hover:border-ink"
        >
          <RefreshCw size={14} />
          Tải lại
        </button>
      </div>

      {/* THÔNG BÁO LỖI */}

      {loi && (
        <div className="mt-5 border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-600">
          {loi}
        </div>
      )}

      {/* THÔNG BÁO THÀNH CÔNG */}

      {thongBao && (
        <div className="mt-5 border border-green-200 bg-green-50 px-5 py-4 text-sm leading-6 text-green-700">
          {thongBao}
        </div>
      )}

      {/* FORM UPLOAD */}

      <form
        onSubmit={xuLyUploadAnh}
        className="mt-7 grid grid-cols-1 gap-7 xl:grid-cols-[260px_minmax(0,1fr)]"
      >
        {/* PREVIEW */}

        <div className="flex min-h-[260px] items-center justify-center overflow-hidden border border-dashed border-line bg-paper">
          {anhXemTruoc ? (
            <img
              src={anhXemTruoc}
              alt="Xem trước ảnh sản phẩm"
              className="h-full max-h-[300px] w-full object-contain"
            />
          ) : (
            <div className="px-5 text-center">
              <ImagePlus size={38} className="mx-auto text-muted-light" />

              <p className="mt-4 text-sm font-medium text-muted">
                Chọn ảnh để xem trước
              </p>

              <p className="mt-2 text-xs text-muted">JPEG, PNG hoặc WebP</p>
            </div>
          )}
        </div>

        {/* FORM FIELDS */}

        <div className="space-y-5">
          {/* FILE */}

          <div>
            <label
              htmlFor="admin-product-image-file"
              className="mb-2 block text-xs font-semibold"
            >
              Chọn hình ảnh *
            </label>

            <input
              id="admin-product-image-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={xuLyChonFile}
              disabled={dangUpload}
              className="w-full border border-line bg-white px-3 py-3 text-sm file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
            />

            {file && (
              <p className="mt-2 break-all text-xs text-muted">
                {file.name} · {dinhDangDungLuong(file.size)}
              </p>
            )}

            <p className="mt-2 text-xs text-muted">
              Dung lượng tối đa 5 MB. Chỉ nhận JPEG, PNG và WebP.
            </p>
          </div>

          {/* MÔ TẢ */}

          <div>
            <label className="mb-2 block text-xs font-semibold">
              Mô tả hình ảnh
            </label>

            <input
              type="text"
              maxLength={200}
              value={moTaAnh}
              onChange={function (event) {
                setMoTaAnh(event.target.value);
              }}
              placeholder="Ví dụ: Mặt trước sản phẩm"
              disabled={dangUpload}
              className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink disabled:bg-paper"
            />
          </div>

          {/* THỨ TỰ HIỂN THỊ */}

          <div>
            <label className="mb-2 block text-xs font-semibold">
              Thứ tự hiển thị
            </label>

            <input
              type="number"
              min="0"
              max="1000"
              step="1"
              value={thuTuHienThi}
              onChange={function (event) {
                setThuTuHienThi(event.target.value);
              }}
              disabled={dangUpload}
              className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink disabled:bg-paper"
            />
          </div>

          {/* ẢNH CHÍNH */}

          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={laAnhChinh}
              onChange={function (event) {
                setLaAnhChinh(event.target.checked);
              }}
              disabled={dangUpload}
              className="h-4 w-4 accent-black"
            />
            Đặt làm ảnh chính sau khi upload
          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={dangUpload || !file}
            className="inline-flex items-center gap-2 bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-ink-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Upload size={15} />

            {dangUpload ? "Đang upload..." : "Upload hình ảnh"}
          </button>
        </div>
      </form>

      {/* DANH SÁCH ẢNH */}

      <div className="mt-10 border-t border-line pt-7">
        <h3 className="text-sm font-bold">Thư viện hình ảnh</h3>

        <p className="mt-2 text-xs text-muted">
          Ảnh chính được đánh dấu để sử dụng làm hình đại diện sản phẩm.
        </p>

        {danhSachAnh.length === 0 ? (
          <div className="mt-6 flex min-h-48 flex-col items-center justify-center border border-dashed border-line text-center">
            <ImagePlus size={35} className="text-gray-300" />

            <p className="mt-4 text-sm font-medium">Chưa có hình ảnh</p>

            <p className="mt-2 text-xs text-muted">
              Hãy upload hình ảnh đầu tiên cho sản phẩm này.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {danhSachAnh.map(function (anh) {
              const dangDatAnhChinh = dangDatAnhChinhId === anh.id;

              const dangXoa = dangXoaId === anh.id;

              const dangXuLy = dangDatAnhChinh || dangXoa;

              return (
                <article
                  key={anh.id}
                  className="overflow-hidden border border-line bg-white"
                >
                  {/* IMAGE */}

                  <div className="relative flex aspect-[4/5] items-center justify-center bg-paper">
                    <img
                      src={anh.duongDanAnh}
                      alt={anh.moTaAnh || "Ảnh sản phẩm"}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />

                    {anh.laAnhChinh && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-2 bg-ink px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white">
                        <Star size={12} fill="currentColor" />
                        Ảnh chính
                      </span>
                    )}
                  </div>

                  {/* INFORMATION */}

                  <div className="p-4">
                    <p className="line-clamp-2 min-h-10 text-sm font-semibold">
                      {anh.moTaAnh || "Không có mô tả"}
                    </p>

                    <p className="mt-2 text-xs text-muted">
                      Thứ tự: {anh.thuTuHienThi}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Ngày tạo: {hienThiNgay(anh.ngayTao)}
                    </p>

                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {!anh.laAnhChinh && (
                        <button
                          type="button"
                          disabled={dangXuLy}
                          onClick={function () {
                            xuLyDatAnhChinh(anh);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-2 border border-line px-3 py-3 text-xs font-semibold transition hover:border-ink disabled:opacity-40"
                        >
                          <Star size={14} />

                          {dangDatAnhChinh ? "Đang đặt..." : "Đặt ảnh chính"}
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={dangXuLy}
                        onClick={function () {
                          xuLyXoaAnh(anh);
                        }}
                        className="inline-flex items-center justify-center gap-2 border border-red-200 px-3 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 size={14} />

                        {dangXoa ? "Đang xóa..." : "Xóa"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
