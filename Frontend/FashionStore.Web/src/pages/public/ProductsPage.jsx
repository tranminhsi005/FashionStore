import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, Filter, X, RefreshCw } from "lucide-react";
import ProductCard from "../../components/products/ProductCard";
import { Reveal } from "../../components/ui";
import {
  layDanhSachSanPham,
  layDanhSachDanhMuc,
  layDanhSachThuongHieu,
  layDanhSachKichCo,
  layDanhSachMauSac,
} from "../../services/productService";
import { layThongBaoLoi } from "../../utils/apiError";

export default function ProductsPage() {
  const [sanPhams, setSanPhams] = useState([]);
  const [danhMucs, setDanhMucs] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [kichCos, setKichCos] = useState([]);
  const [mauSacs, setMauSacs] = useState([]);

  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [trang, setTrang] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(0);
  const [tongSoSanPham, setTongSoSanPham] = useState(0);
  const [taiLai, setTaiLai] = useState(0);

  const [tuKhoaNhap, setTuKhoaNhap] = useState("");

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

  const [giaTuNhap, setGiaTuNhap] = useState("");
  const [giaDenNhap, setGiaDenNhap] = useState("");

  useEffect(() => {
    let alive = true;
    async function taiDuLieuBoLoc() {
      try {
        const [dm, th, kc, ms] = await Promise.all([
          layDanhSachDanhMuc().catch(() => []),
          layDanhSachThuongHieu().catch(() => []),
          layDanhSachKichCo().catch(() => []),
          layDanhSachMauSac().catch(() => []),
        ]);
        if (alive) {
          setDanhMucs(dm || []);
          setThuongHieus(th || []);
          setKichCos(kc || []);
          setMauSacs(ms || []);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu bộ lọc:", error);
      }
    }
    taiDuLieuBoLoc();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    async function taiDanhSach() {
      setDangTai(true);
      setLoi("");
      try {
        const params = {
          trang,
          kichThuocTrang: 12,
          sapXep: boLoc.sapXep,
        };
        if (boLoc.tuKhoa) params.tuKhoa = boLoc.tuKhoa;
        if (boLoc.danhMucId) params.danhMucId = boLoc.danhMucId;
        if (boLoc.thuongHieuId) params.thuongHieuId = boLoc.thuongHieuId;
        if (boLoc.kichCoId) params.kichCoId = boLoc.kichCoId;
        if (boLoc.mauSacId) params.mauSacId = boLoc.mauSacId;
        if (boLoc.giaTu !== "") params.giaTu = Number(boLoc.giaTu);
        if (boLoc.giaDen !== "") params.giaDen = Number(boLoc.giaDen);

        const ketQua = await layDanhSachSanPham(params);
        if (!alive) return;
        setSanPhams(ketQua.items || []);
        setTongSoTrang(ketQua.tongSoTrang || 0);
        setTongSoSanPham(ketQua.tongSoBanGhi || 0);
      } catch (error) {
        if (alive) {
          setSanPhams([]);
          setLoi(layThongBaoLoi(error));
        }
      } finally {
        if (alive) setDangTai(false);
      }
    }
    taiDanhSach();
    return () => {
      alive = false;
    };
  }, [boLoc, trang, taiLai]);

  function capNhatBoLoc(tenTruong, giaTri) {
    setBoLoc((cu) => ({ ...cu, [tenTruong]: giaTri }));
    setTrang(1);
  }

  function xuLyTimKiem(e) {
    e.preventDefault();
    capNhatBoLoc("tuKhoa", tuKhoaNhap.trim());
  }

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
    setBoLoc((cu) => ({ ...cu, giaTu: giaTuNhap, giaDen: giaDenNhap }));
    setTrang(1);
  }

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

  return (
    <main className="catalog-page relative min-h-screen overflow-x-hidden bg-[#060608] text-[#f3f0fa]">
      {/* Top Giant Purple Aurora Radial Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 5%, rgba(168, 85, 247, 0.18) 0%, rgba(99, 102, 241, 0.08) 35%, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-shell relative z-10 py-10">
        {/* BREADCRUMB */}
        <div className="mb-6 flex items-center gap-2 text-xs text-white/40">
          <Link to="/" className="transition-colors hover:text-purple-400">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-purple-300">Bộ sưu tập sản phẩm</span>
        </div>

        {/* HEADER SECTION */}
        <div className="catalog-heading mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-[11px] font-bold text-purple-300">
              <Sparkles size={12} />
              DISCOVER OUR CATALOG
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Sản phẩm{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                2026.
              </span>
            </h1>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/60">
            Khám phá các thiết kế thời trang thế hệ mới được tuyển chọn dành riêng
            cho phong cách độc bản của bạn.
          </p>
        </div>

        {/* SEARCH BAR (REACTBITS PILL SEARCH) */}
        <form onSubmit={xuLyTimKiem} className="mb-10">
          <div className="catalog-search-box relative flex items-center overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a14]/90 backdrop-blur-xl transition-all duration-300 focus-within:border-purple-500/60 focus-within:shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            <Search className="ml-5 text-purple-400 shrink-0" size={18} />
            <input
              type="text"
              value={tuKhoaNhap}
              onChange={(e) => setTuKhoaNhap(e.target.value)}
              placeholder="Tìm kiếm sản phẩm theo tên, chất liệu, SKU..."
              className="w-full bg-transparent px-4 py-4 text-sm text-white placeholder-white/35 outline-none"
            />
            <button
              type="submit"
              className="m-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all hover:from-purple-500 hover:to-indigo-500"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* MAIN GRID: SIDEBAR & PRODUCT LIST */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* SIDEBAR FILTERS (REACTBITS GLASS PANEL) */}
          <aside className="catalog-filter-panel h-fit rounded-2xl border border-white/10 bg-[#0c0a14]/80 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                <Filter size={14} />
                <span>Bộ lọc</span>
              </div>
              <button
                type="button"
                onClick={xoaBoLoc}
                className="text-xs text-white/40 underline underline-offset-4 transition-colors hover:text-purple-300"
              >
                Xóa tất cả
              </button>
            </div>

            {/* DANH MỤC */}
            <div className="mb-6 border-b border-white/10 pb-6">
              <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">
                Danh mục
              </label>
              <select
                value={boLoc.danhMucId}
                onChange={(e) => capNhatBoLoc("danhMucId", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none transition-colors focus:border-purple-500"
              >
                <option value="">Tất cả danh mục</option>
                {danhMucs.map((dm) => (
                  <option key={dm.id} value={dm.id}>
                    {dm.ten}
                  </option>
                ))}
              </select>
            </div>

            {/* THƯƠNG HIỆU */}
            <div className="mb-6 border-b border-white/10 pb-6">
              <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">
                Thương hiệu
              </label>
              <select
                value={boLoc.thuongHieuId}
                onChange={(e) => capNhatBoLoc("thuongHieuId", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none transition-colors focus:border-purple-500"
              >
                <option value="">Tất cả thương hiệu</option>
                {thuongHieus.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.ten}
                  </option>
                ))}
              </select>
            </div>

            {/* KÍCH CỠ */}
            <div className="mb-6 border-b border-white/10 pb-6">
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-white/50">
                Kích cỡ
              </label>
              <div className="flex flex-wrap gap-1.5">
                {kichCos.map((kc) => {
                  const dangChon = boLoc.kichCoId === kc.id;
                  return (
                    <button
                      key={kc.id}
                      type="button"
                      onClick={() =>
                        capNhatBoLoc("kichCoId", dangChon ? "" : kc.id)
                      }
                      className={`min-w-9 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                        dangChon
                          ? "border-purple-500 bg-purple-600/20 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]"
                          : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {kc.tenHienThi}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MÀU SẮC */}
            <div className="mb-6 border-b border-white/10 pb-6">
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-white/50">
                Màu sắc
              </label>
              <div className="flex flex-wrap gap-2.5">
                {mauSacs.map((ms) => {
                  const dangChon = boLoc.mauSacId === ms.id;
                  return (
                    <button
                      key={ms.id}
                      type="button"
                      title={ms.ten}
                      aria-label={ms.ten}
                      onClick={() =>
                        capNhatBoLoc("mauSacId", dangChon ? "" : ms.id)
                      }
                      className={`h-7 w-7 rounded-full border transition-all ${
                        dangChon
                          ? "scale-115 border-purple-400 ring-2 ring-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                          : "border-white/20 hover:scale-110 hover:border-white"
                      }`}
                      style={{ backgroundColor: ms.maHex || "#888888" }}
                    />
                  );
                })}
              </div>
            </div>

            {/* KHOẢNG GIÁ */}
            <div>
              <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">
                Khoảng giá (VNĐ)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={giaTuNhap}
                  onChange={(e) => setGiaTuNhap(e.target.value)}
                  placeholder="Từ"
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white outline-none focus:border-purple-500"
                />
                <input
                  type="number"
                  min="0"
                  value={giaDenNhap}
                  onChange={(e) => setGiaDenNhap(e.target.value)}
                  placeholder="Đến"
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={xuLyLocGia}
                className="mt-3.5 w-full rounded-xl border border-purple-500/40 bg-purple-500/10 py-2.5 text-xs font-bold uppercase tracking-wider text-purple-300 transition-all hover:bg-purple-600 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Áp dụng giá
              </button>
            </div>
          </aside>

          {/* PRODUCT LIST SECTION */}
          <section>
            {/* TOOLBAR */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0c0a14]/60 px-5 py-3.5 backdrop-blur-xl">
              <p className="text-xs text-white/60">
                Hiển thị{" "}
                <span className="font-bold text-purple-300">
                  {tongSoSanPham}
                </span>{" "}
                sản phẩm
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Sắp xếp:</span>
                <select
                  value={boLoc.sapXep}
                  onChange={(e) => capNhatBoLoc("sapXep", e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white outline-none transition-colors focus:border-purple-500"
                >
                  <option value="moi-nhat">Mới nhất</option>
                  <option value="cu-nhat">Cũ nhất</option>
                  <option value="gia-tang">Giá tăng dần</option>
                  <option value="gia-giam">Giá giảm dần</option>
                  <option value="ten-a-z">Tên A - Z</option>
                  <option value="ten-z-a">Tên Z - A</option>
                </select>
              </div>
            </div>

            {/* ERROR */}
            {loi && (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-300">
                <span>{loi}</span>
                <button
                  type="button"
                  onClick={() => setTaiLai((c) => c + 1)}
                  className="font-bold underline"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* LOADING SKELETON */}
            {dangTai && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]"
                  />
                ))}
              </div>
            )}

            {/* PRODUCTS GRID */}
            {!dangTai && !loi && sanPhams.length > 0 && (
              <div className="catalog-product-grid grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {sanPhams.map((sp, index) => (
                  <Reveal key={sp.id} className="h-full" delay={(index % 4) * 0.045} y={18}>
                    <ProductCard sanPham={sp} />
                  </Reveal>
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {!dangTai && !loi && sanPhams.length === 0 && (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0c0a14]/60 p-8 text-center backdrop-blur-xl">
                <div className="text-6xl font-light text-white/10">0</div>
                <h3 className="mt-4 text-base font-bold text-white">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="mt-1 text-xs text-white/40">
                  Thử thay đổi từ khóa hoặc xóa bộ lọc để hiển thị thêm sản phẩm.
                </p>
                <button
                  type="button"
                  onClick={xoaBoLoc}
                  className="mt-5 rounded-full border border-purple-500/40 bg-purple-500/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-purple-300 hover:bg-purple-600 hover:text-white"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* PAGINATION (REACTBITS PILL BUTTONS) */}
            {!dangTai && tongSoTrang > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={trang <= 1}
                  onClick={() => setTrang(trang - 1)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:border-purple-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Trước
                </button>

                <span className="px-4 text-xs font-bold text-purple-300">
                  Trang {trang} / {tongSoTrang}
                </span>

                <button
                  type="button"
                  disabled={trang >= tongSoTrang}
                  onClick={() => setTrang(trang + 1)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:border-purple-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
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
