import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import ProductCard from "../../components/products/ProductCard";

import {
  layDanhSachSanPham,
  layDanhSachDanhMuc,
  layDanhSachThuongHieu,
  layDanhSachKichCo,
  layDanhSachMauSac,
} from "../../services/productService";

import { layThongBaoLoi } from "../../utils/apiError";

export default function ProductsPage() {
  // =============================================
  // DANH SÁCH DỮ LIỆU
  // =============================================

  const [sanPhams, setSanPhams] = useState([]);

  const [danhMucs, setDanhMucs] = useState([]);

  const [thuongHieus, setThuongHieus] = useState([]);

  const [kichCos, setKichCos] = useState([]);

  const [mauSacs, setMauSacs] = useState([]);

  // =============================================
  // TRẠNG THÁI GIAO DIỆN
  // =============================================

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [trang, setTrang] = useState(1);

  const [tongSoTrang, setTongSoTrang] = useState(0);

  const [tongSoSanPham, setTongSoSanPham] = useState(0);

  const [taiLai, setTaiLai] = useState(0);

  // =============================================
  // TÌM KIẾM
  // =============================================

  const [tuKhoaNhap, setTuKhoaNhap] = useState("");

  // =============================================
  // BỘ LỌC
  // =============================================

  const [boLoc, setBoLoc] = useState({
    tuKhoa: "",

    danhMucId: "",

    thuongHieuId: "",

    kichCoId: "",

    mauSacId: "",

    giaTu: "",

    giaDen: "",

    sapXep: "moi-nhat",
  });

  // Giá nhập riêng, chỉ áp dụng khi nhấn nút lọc giá
  const [giaTuNhap, setGiaTuNhap] = useState("");

  const [giaDenNhap, setGiaDenNhap] = useState("");

  // =============================================
  // LẤY DANH MỤC, THƯƠNG HIỆU, KÍCH CỠ, MÀU SẮC
  // =============================================

  useEffect(function () {
    let componentConTonTai = true;

    async function taiDuLieuBoLoc() {
      try {
        const ketQua = await Promise.all([
          layDanhSachDanhMuc().catch(() => []),

          layDanhSachThuongHieu().catch(() => []),

          layDanhSachKichCo().catch(() => []),

          layDanhSachMauSac().catch(() => []),
        ]);

        if (componentConTonTai) {
          setDanhMucs(ketQua[0] || []);

          setThuongHieus(ketQua[1] || []);

          setKichCos(ketQua[2] || []);

          setMauSacs(ketQua[3] || []);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu bộ lọc:", error);
      }
    }

    taiDuLieuBoLoc();

    return function () {
      componentConTonTai = false;
    };
  }, []);

  // =============================================
  // LẤY DANH SÁCH SẢN PHẨM
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiDanhSachSanPham() {
        setDangTai(true);

        setLoi("");

        try {
          const params = {
            trang: trang,

            kichThuocTrang: 12,

            sapXep: boLoc.sapXep,
          };

          // Tìm kiếm
          if (boLoc.tuKhoa) {
            params.tuKhoa = boLoc.tuKhoa;
          }

          // Lọc danh mục
          if (boLoc.danhMucId) {
            params.danhMucId = boLoc.danhMucId;
          }

          // Lọc thương hiệu
          if (boLoc.thuongHieuId) {
            params.thuongHieuId = boLoc.thuongHieuId;
          }

          // Lọc kích cỡ
          if (boLoc.kichCoId) {
            params.kichCoId = boLoc.kichCoId;
          }

          // Lọc màu sắc
          if (boLoc.mauSacId) {
            params.mauSacId = boLoc.mauSacId;
          }

          // Giá thấp nhất
          if (boLoc.giaTu !== "") {
            params.giaTu = Number(boLoc.giaTu);
          }

          // Giá cao nhất
          if (boLoc.giaDen !== "") {
            params.giaDen = Number(boLoc.giaDen);
          }

          const ketQua = await layDanhSachSanPham(params);

          if (!componentConTonTai) {
            return;
          }

          setSanPhams(ketQua.items || []);

          setTongSoTrang(ketQua.tongSoTrang || 0);

          setTongSoSanPham(ketQua.tongSoBanGhi || 0);
        } catch (error) {
          if (componentConTonTai) {
            setSanPhams([]);

            setLoi(layThongBaoLoi(error));
          }
        } finally {
          if (componentConTonTai) {
            setDangTai(false);
          }
        }
      }

      taiDanhSachSanPham();

      return function () {
        componentConTonTai = false;
      };
    },
    [boLoc, trang, taiLai],
  );

  // =============================================
  // CẬP NHẬT BỘ LỌC
  // =============================================

  function capNhatBoLoc(tenTruong, giaTri) {
    setBoLoc(function (cu) {
      return {
        ...cu,
        [tenTruong]: giaTri,
      };
    });

    setTrang(1);
  }

  // =============================================
  // TÌM KIẾM
  // =============================================

  function xuLyTimKiem(event) {
    event.preventDefault();

    capNhatBoLoc("tuKhoa", tuKhoaNhap.trim());
  }

  // =============================================
  // ÁP DỤNG KHOẢNG GIÁ
  // =============================================

  function xuLyLocGia() {
    if (
      giaTuNhap !== "" &&
      giaDenNhap !== "" &&
      Number(giaTuNhap) > Number(giaDenNhap)
    ) {
      setLoi("Giá thấp nhất không được lớn hơn giá cao nhất.");

      return;
    }

    setLoi("");

    setBoLoc(function (cu) {
      return {
        ...cu,
        giaTu: giaTuNhap,
        giaDen: giaDenNhap,
      };
    });

    setTrang(1);
  }

  // =============================================
  // XÓA TẤT CẢ BỘ LỌC
  // =============================================

  function xoaBoLoc() {
    setTuKhoaNhap("");

    setGiaTuNhap("");

    setGiaDenNhap("");

    setTrang(1);

    setBoLoc({
      tuKhoa: "",

      danhMucId: "",

      thuongHieuId: "",

      kichCoId: "",

      mauSacId: "",

      giaTu: "",

      giaDen: "",

      sapXep: "moi-nhat",
    });
  }

  // =============================================
  // HIỂN THỊ
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

          <span className="text-black">Sản phẩm</span>
        </div>

        {/* TIÊU ĐỀ */}

        <div className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
            Explore our collection
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Sản phẩm
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
            Khám phá các thiết kế thời trang được tuyển chọn dành cho phong cách
            riêng của bạn.
          </p>
        </div>

        {/* TÌM KIẾM */}

        <form
          onSubmit={xuLyTimKiem}
          className="mb-8 flex border-b border-gray-300"
        >
          <input
            type="text"
            value={tuKhoaNhap}
            onChange={(event) => setTuKhoaNhap(event.target.value)}
            placeholder="Tìm kiếm sản phẩm, tên hoặc SKU..."
            className="w-full bg-transparent px-2 py-4 text-sm outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            className="shrink-0 px-5 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-gray-500"
          >
            Tìm kiếm
          </button>
        </form>

        {/* NỘI DUNG */}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* =================================
                        SIDEBAR BỘ LỌC
                    ================================= */}

          <aside>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest">
                Bộ lọc
              </h2>

              <button
                type="button"
                onClick={xoaBoLoc}
                className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
              >
                Xóa tất cả
              </button>
            </div>

            {/* DANH MỤC */}

            <div className="mb-7 border-b border-gray-200 pb-7">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest">
                Danh mục
              </label>

              <select
                value={boLoc.danhMucId}
                onChange={(event) =>
                  capNhatBoLoc("danhMucId", event.target.value)
                }
                className="w-full border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-black"
              >
                <option value="">Tất cả danh mục</option>

                {danhMucs.map(function (danhMuc) {
                  return (
                    <option key={danhMuc.id} value={danhMuc.id}>
                      {danhMuc.ten}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* THƯƠNG HIỆU */}

            <div className="mb-7 border-b border-gray-200 pb-7">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest">
                Thương hiệu
              </label>

              <select
                value={boLoc.thuongHieuId}
                onChange={(event) =>
                  capNhatBoLoc("thuongHieuId", event.target.value)
                }
                className="w-full border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-black"
              >
                <option value="">Tất cả thương hiệu</option>

                {thuongHieus.map(function (thuongHieu) {
                  return (
                    <option key={thuongHieu.id} value={thuongHieu.id}>
                      {thuongHieu.ten}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* KÍCH CỠ */}

            <div className="mb-7 border-b border-gray-200 pb-7">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest">
                Kích cỡ
              </label>

              <div className="flex flex-wrap gap-2">
                {kichCos.map(function (kichCo) {
                  const dangChon = boLoc.kichCoId === kichCo.id;

                  return (
                    <button
                      key={kichCo.id}
                      type="button"
                      onClick={() =>
                        capNhatBoLoc("kichCoId", dangChon ? "" : kichCo.id)
                      }
                      className={`min-w-10 border px-3 py-2 text-xs transition-colors ${
                        dangChon
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-transparent hover:border-black"
                      }`}
                    >
                      {kichCo.tenHienThi}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MÀU SẮC */}

            <div className="mb-7 border-b border-gray-200 pb-7">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest">
                Màu sắc
              </label>

              <div className="flex flex-wrap gap-3">
                {mauSacs.map(function (mauSac) {
                  const dangChon = boLoc.mauSacId === mauSac.id;

                  return (
                    <button
                      key={mauSac.id}
                      type="button"
                      title={mauSac.ten}
                      aria-label={mauSac.ten}
                      onClick={() =>
                        capNhatBoLoc("mauSacId", dangChon ? "" : mauSac.id)
                      }
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        dangChon
                          ? "scale-110 border-black ring-2 ring-gray-300"
                          : "border-white shadow-sm hover:scale-110"
                      }`}
                      style={{
                        backgroundColor: mauSac.maHex || "#cccccc",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* KHOẢNG GIÁ */}

            <div className="mb-7">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest">
                Khoảng giá
              </label>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={giaTuNhap}
                  onChange={(event) => setGiaTuNhap(event.target.value)}
                  placeholder="Từ"
                  className="min-w-0 border-b border-gray-300 bg-transparent px-1 py-3 text-sm outline-none focus:border-black"
                />

                <input
                  type="number"
                  min="0"
                  value={giaDenNhap}
                  onChange={(event) => setGiaDenNhap(event.target.value)}
                  placeholder="Đến"
                  className="min-w-0 border-b border-gray-300 bg-transparent px-1 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <button
                type="button"
                onClick={xuLyLocGia}
                className="mt-4 w-full border border-black px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
              >
                Áp dụng giá
              </button>
            </div>
          </aside>

          {/* =================================
                        DANH SÁCH SẢN PHẨM
                    ================================= */}

          <section>
            {/* TOOLBAR */}

            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Hiển thị
                <span className="mx-1 font-semibold text-black">
                  {tongSoSanPham}
                </span>
                sản phẩm
              </p>

              <select
                value={boLoc.sapXep}
                onChange={(event) => capNhatBoLoc("sapXep", event.target.value)}
                className="border-b border-gray-300 bg-transparent px-2 py-3 text-xs outline-none focus:border-black"
              >
                <option value="moi-nhat">Mới nhất</option>

                <option value="cu-nhat">Cũ nhất</option>

                <option value="gia-tang">Giá tăng dần</option>

                <option value="gia-giam">Giá giảm dần</option>

                <option value="ten-a-z">Tên A - Z</option>

                <option value="ten-z-a">Tên Z - A</option>
              </select>
            </div>

            {/* LỖI */}

            {loi && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                <span>{loi}</span>

                <button
                  type="button"
                  onClick={() => setTaiLai(taiLai + 1)}
                  className="font-semibold underline underline-offset-4"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* LOADING */}

            {dangTai && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map(function (_, index) {
                  return (
                    <div key={index}>
                      <div className="aspect-[3/4] animate-pulse bg-gray-200"></div>

                      <div className="mt-4 h-3 w-1/3 animate-pulse bg-gray-200"></div>

                      <div className="mt-3 h-4 w-2/3 animate-pulse bg-gray-200"></div>

                      <div className="mt-3 h-3 w-1/2 animate-pulse bg-gray-200"></div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* DANH SÁCH */}

            {!dangTai && !loi && sanPhams.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
                {sanPhams.map(function (sanPham) {
                  return <ProductCard key={sanPham.id} sanPham={sanPham} />;
                })}
              </div>
            )}

            {/* KHÔNG CÓ SẢN PHẨM */}

            {!dangTai && !loi && sanPhams.length === 0 && (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <p className="text-5xl font-light text-gray-300">0</p>

                <h3 className="mt-5 text-lg font-semibold">
                  Không tìm thấy sản phẩm
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
                  Thử thay đổi từ khóa tìm kiếm hoặc xóa một số bộ lọc để xem
                  thêm sản phẩm.
                </p>

                <button
                  type="button"
                  onClick={xoaBoLoc}
                  className="mt-6 border border-black px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-black hover:text-white"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* PHÂN TRANG */}

            {!dangTai && tongSoTrang > 1 && (
              <div className="mt-14 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={trang <= 1}
                  onClick={() => setTrang(trang - 1)}
                  className="border border-gray-300 px-4 py-3 text-xs transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Trước
                </button>

                <span className="px-4 text-sm">
                  Trang {trang} / {tongSoTrang}
                </span>

                <button
                  type="button"
                  disabled={trang >= tongSoTrang}
                  onClick={() => setTrang(trang + 1)}
                  className="border border-gray-300 px-4 py-3 text-xs transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Tiếp →
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
