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
  // STYLES (inline để tránh cần custom CSS)
  // =============================================

  const glassPanel = {
    background: "rgba(13,13,20,0.8)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: "8px",
  };

  const glassInput = {
    background: "rgba(255,255,255,0.03)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
    width: "100%",
  };

  const darkSelectStyle = {
    background: "rgba(13,13,20,0.9)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(240,240,245,0.85)",
    borderRadius: "6px",
    padding: "10px 12px",
    outline: "none",
    width: "100%",
    cursor: "pointer",
  };

  const sectionLabelStyle = {
    display: "block",
    marginBottom: "10px",
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "rgba(240,240,245,0.4)",
  };

  const dividerStyle = {
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "20px",
    paddingBottom: "20px",
  };

  // =============================================
  // HIỂN THỊ
  // =============================================

  return (
    <main
      className="min-h-screen"
      style={{ background: "#030303", color: "#f0f0f5", position: "relative" }}
    >
      {/* AMBIENT ORBS */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          right: "-100px",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(0,217,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-200px",
          left: "-100px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="relative mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12"
        style={{ zIndex: 1 }}
      >
        {/* BREADCRUMB */}

        <div
          className="mb-8 flex items-center gap-2 text-xs"
          style={{ color: "rgba(240,240,245,0.35)" }}
        >
          <Link
            to="/"
            style={{ color: "rgba(240,240,245,0.35)", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.target.style.color = "#00d9ff")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(240,240,245,0.35)")}
          >
            Trang chủ
          </Link>

          <span>/</span>

          <span style={{ color: "rgba(240,240,245,0.7)" }}>Sản phẩm</span>
        </div>

        {/* TIÊU ĐỀ */}

        <div
          className="mb-10 pb-8"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="mb-3 text-[11px] font-semibold uppercase"
            style={{ letterSpacing: "0.3em", color: "#00d9ff" }}
          >
            Explore our collection
          </p>

          <h1
            className="text-4xl font-semibold tracking-tight sm:text-6xl"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, rgba(240,240,245,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Sản phẩm
          </h1>

          <p
            className="mt-4 max-w-xl text-sm leading-7"
            style={{ color: "rgba(240,240,245,0.45)" }}
          >
            Khám phá các thiết kế thời trang được tuyển chọn dành cho phong cách
            riêng của bạn.
          </p>
        </div>

        {/* TÌM KIẾM */}

        <form
          onSubmit={xuLyTimKiem}
          className="mb-8 flex items-center"
          style={glassInput}
        >
          <input
            type="text"
            value={tuKhoaNhap}
            onChange={(event) => setTuKhoaNhap(event.target.value)}
            placeholder="Tìm kiếm sản phẩm, tên hoặc SKU..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "white",
              outline: "none",
              padding: "16px 16px",
              fontSize: "14px",
            }}
            className="placeholder-[rgba(255,255,255,0.4)]"
            onFocus={(e) => {
              e.target.closest("form").style.borderBottom = "1px solid #00d9ff";
              e.target.closest("form").style.boxShadow = "0 4px 20px rgba(0,217,255,0.08)";
            }}
            onBlur={(e) => {
              e.target.closest("form").style.borderBottom = "1px solid rgba(255,255,255,0.1)";
              e.target.closest("form").style.boxShadow = "none";
            }}
          />

          <button
            type="submit"
            className="shrink-0 px-5 text-xs font-semibold uppercase tracking-widest transition-colors"
            style={{ color: "rgba(240,240,245,0.5)", letterSpacing: "0.15em" }}
            onMouseEnter={(e) => (e.target.style.color = "#00d9ff")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(240,240,245,0.5)")}
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
            <div style={glassPanel} className="p-5">
              <div className="mb-6 flex items-center justify-between">
                <h2
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(240,240,245,0.85)" }}
                >
                  Bộ lọc
                </h2>

                <button
                  type="button"
                  onClick={xoaBoLoc}
                  className="text-xs underline underline-offset-4 transition-colors"
                  style={{ color: "rgba(240,240,245,0.4)" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00d9ff")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(240,240,245,0.4)")}
                >
                  Xóa tất cả
                </button>
              </div>

              {/* DANH MỤC */}

              <div style={dividerStyle}>
                <label style={sectionLabelStyle}>Danh mục</label>

                <select
                  value={boLoc.danhMucId}
                  onChange={(event) =>
                    capNhatBoLoc("danhMucId", event.target.value)
                  }
                  style={darkSelectStyle}
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

              <div style={dividerStyle}>
                <label style={sectionLabelStyle}>Thương hiệu</label>

                <select
                  value={boLoc.thuongHieuId}
                  onChange={(event) =>
                    capNhatBoLoc("thuongHieuId", event.target.value)
                  }
                  style={darkSelectStyle}
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

              <div style={dividerStyle}>
                <label style={sectionLabelStyle}>Kích cỡ</label>

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
                        style={{
                          minWidth: "40px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          border: dangChon
                            ? "1px solid #00d9ff"
                            : "1px solid rgba(255,255,255,0.12)",
                          background: dangChon
                            ? "rgba(0,217,255,0.1)"
                            : "rgba(255,255,255,0.03)",
                          color: dangChon ? "#00d9ff" : "rgba(240,240,245,0.7)",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {kichCo.tenHienThi}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MÀU SẮC */}

              <div style={dividerStyle}>
                <label style={sectionLabelStyle}>Màu sắc</label>

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
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: mauSac.maHex || "#cccccc",
                          border: dangChon
                            ? "2px solid #00d9ff"
                            : "2px solid rgba(255,255,255,0.15)",
                          boxShadow: dangChon
                            ? "0 0 0 2px rgba(0,217,255,0.3)"
                            : "none",
                          transform: dangChon ? "scale(1.15)" : "scale(1)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* KHOẢNG GIÁ */}

              <div>
                <label style={sectionLabelStyle}>Khoảng giá</label>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={giaTuNhap}
                    onChange={(event) => setGiaTuNhap(event.target.value)}
                    placeholder="Từ"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      fontSize: "13px",
                      outline: "none",
                      minWidth: 0,
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid #00d9ff";
                      e.target.style.boxShadow = "0 0 0 2px rgba(0,217,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />

                  <input
                    type="number"
                    min="0"
                    value={giaDenNhap}
                    onChange={(event) => setGiaDenNhap(event.target.value)}
                    placeholder="Đến"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      fontSize: "13px",
                      outline: "none",
                      minWidth: 0,
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid #00d9ff";
                      e.target.style.boxShadow = "0 0 0 2px rgba(0,217,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={xuLyLocGia}
                  className="mt-4 w-full px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-all"
                  style={{
                    background: "rgba(0,217,255,0.05)",
                    border: "1px solid rgba(0,217,255,0.3)",
                    color: "#00d9ff",
                    borderRadius: "6px",
                    letterSpacing: "0.15em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,217,255,0.12)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(0,217,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,217,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Áp dụng giá
                </button>
              </div>
            </div>
          </aside>

          {/* =================================
                        DANH SÁCH SẢN PHẨM
                    ================================= */}

          <section>
            {/* TOOLBAR */}

            <div
              className="mb-7 flex flex-wrap items-center justify-between gap-4 px-4 py-3"
              style={{
                background: "rgba(13,13,20,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
              }}
            >
              <p className="text-sm" style={{ color: "rgba(240,240,245,0.5)" }}>
                Hiển thị
                <span
                  className="mx-1 font-semibold"
                  style={{ color: "#ffffff" }}
                >
                  {tongSoSanPham}
                </span>
                sản phẩm
              </p>

              <select
                value={boLoc.sapXep}
                onChange={(event) => capNhatBoLoc("sapXep", event.target.value)}
                style={{
                  background: "rgba(13,13,20,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(240,240,245,0.75)",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  outline: "none",
                  cursor: "pointer",
                }}
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
              <div
                className="mb-6 flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#fca5a5",
                  borderRadius: "8px",
                }}
              >
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
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map(function (_, index) {
                  return (
                    <div key={index}>
                      <div
                        className="aspect-[3/4] animate-pulse"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "4px",
                        }}
                      />

                      <div
                        className="mt-4 h-3 w-1/3 animate-pulse"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "2px",
                        }}
                      />

                      <div
                        className="mt-3 h-4 w-2/3 animate-pulse"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "2px",
                        }}
                      />

                      <div
                        className="mt-3 h-3 w-1/2 animate-pulse"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* DANH SÁCH */}

            {!dangTai && !loi && sanPhams.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-4">
                {sanPhams.map(function (sanPham) {
                  return <ProductCard key={sanPham.id} sanPham={sanPham} />;
                })}
              </div>
            )}

            {/* KHÔNG CÓ SẢN PHẨM */}

            {!dangTai && !loi && sanPhams.length === 0 && (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <p
                  className="text-7xl font-light"
                  style={{ color: "rgba(255,255,255,0.08)" }}
                >
                  ∅
                </p>

                <h3
                  className="mt-5 text-lg font-semibold"
                  style={{ color: "rgba(240,240,245,0.85)" }}
                >
                  Không tìm thấy sản phẩm
                </h3>

                <p
                  className="mt-2 max-w-sm text-sm leading-6"
                  style={{ color: "rgba(240,240,245,0.4)" }}
                >
                  Thử thay đổi từ khóa tìm kiếm hoặc xóa một số bộ lọc để xem
                  thêm sản phẩm.
                </p>

                <button
                  type="button"
                  onClick={xoaBoLoc}
                  className="mt-6 px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-all"
                  style={{
                    background: "rgba(0,217,255,0.05)",
                    border: "1px solid rgba(0,217,255,0.3)",
                    color: "#00d9ff",
                    borderRadius: "6px",
                    letterSpacing: "0.15em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,217,255,0.12)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(0,217,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,217,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
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
                  className="px-4 py-3 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-30"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(240,240,245,0.7)",
                    borderRadius: "6px",
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.borderColor = "rgba(0,217,255,0.4)";
                      e.currentTarget.style.color = "#00d9ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(240,240,245,0.7)";
                  }}
                >
                  ← Trước
                </button>

                <span
                  className="px-4 text-sm"
                  style={{ color: "rgba(240,240,245,0.5)" }}
                >
                  Trang{" "}
                  <span style={{ color: "#00d9ff", fontWeight: 600 }}>
                    {trang}
                  </span>{" "}
                  / {tongSoTrang}
                </span>

                <button
                  type="button"
                  disabled={trang >= tongSoTrang}
                  onClick={() => setTrang(trang + 1)}
                  className="px-4 py-3 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-30"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(240,240,245,0.7)",
                    borderRadius: "6px",
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.borderColor = "rgba(0,217,255,0.4)";
                      e.currentTarget.style.color = "#00d9ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(240,240,245,0.7)";
                  }}
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
