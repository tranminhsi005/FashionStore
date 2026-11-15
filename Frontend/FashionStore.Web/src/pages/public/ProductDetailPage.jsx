import { useEffect, useState } from "react";

import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

import { layChiTietSanPham } from "../../services/productService";

import { themVaoGioHang } from "../../services/cartService";

import { dinhDangTienVietNam } from "../../utils/formatCurrency";

import { layThongBaoLoi } from "../../utils/apiError";

import { useAuth } from "../../contexts/AuthContext";

import { useCart } from "../../contexts/CartContext";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  // =============================================
  // AUTHENTICATION
  // =============================================

  const { daDangNhap, coVaiTro } = useAuth();

  // =============================================
  // CART CONTEXT
  // =============================================

  const { capNhatGioHang } = useCart();

  // =============================================
  // PRODUCT STATE
  // =============================================

  const [sanPham, setSanPham] = useState(null);

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  // =============================================
  // PRODUCT IMAGE
  // =============================================

  const [anhDangChon, setAnhDangChon] = useState("");

  // =============================================
  // PRODUCT VARIANT
  // =============================================

  const [kichCoId, setKichCoId] = useState(null);

  const [mauSacId, setMauSacId] = useState(null);

  // =============================================
  // ADD TO CART STATE
  // =============================================

  const [soLuongThem, setSoLuongThem] = useState(1);

  const [dangThemVaoGio, setDangThemVaoGio] = useState(false);

  const [thongBaoGioHang, setThongBaoGioHang] = useState("");

  const [loiGioHang, setLoiGioHang] = useState("");

  // =============================================
  // TẢI CHI TIẾT SẢN PHẨM
  // =============================================

  useEffect(
    function () {
      let componentConTonTai = true;

      async function taiChiTiet() {
        setDangTai(true);

        setLoi("");

        setSanPham(null);

        setAnhDangChon("");

        setKichCoId(null);

        setMauSacId(null);

        setThongBaoGioHang("");

        setLoiGioHang("");

        try {
          const ketQua = await layChiTietSanPham(slug);

          if (!componentConTonTai) {
            return;
          }

          setSanPham(ketQua);

          // Chọn ảnh chính đầu tiên

          const anhChinh = ketQua.anhSanPhams?.find(function (anh) {
            return anh.laAnhChinh;
          });

          const anhDauTien = anhChinh || ketQua.anhSanPhams?.[0];

          setAnhDangChon(anhDauTien?.duongDanAnh || "");

          // Chọn biến thể còn hàng đầu tiên

          const bienTheMacDinh =
            ketQua.bienThes?.find(function (bienThe) {
              return bienThe.conHang;
            }) || ketQua.bienThes?.[0];

          setKichCoId(bienTheMacDinh?.kichCoId || null);

          setMauSacId(bienTheMacDinh?.mauSacId || null);
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

      taiChiTiet();

      return function () {
        componentConTonTai = false;
      };
    },
    [slug],
  );

  // =============================================
  // LẤY DANH SÁCH BIẾN THỂ VÀ HÌNH ẢNH
  // =============================================

  const bienThes = sanPham?.bienThes || [];

  const anhSanPhams = sanPham?.anhSanPhams || [];

  // =============================================
  // TẠO DANH SÁCH KÍCH CỠ KHÔNG TRÙNG
  // =============================================

  const kichCos = [];

  bienThes.forEach(function (bienThe) {
    if (!bienThe.kichCoId) {
      return;
    }

    const daTonTai = kichCos.some(function (kichCo) {
      return kichCo.id === bienThe.kichCoId;
    });

    if (!daTonTai) {
      kichCos.push({
        id: bienThe.kichCoId,

        ten: bienThe.tenKichCo,

        conHang: bienThes.some(function (item) {
          return item.kichCoId === bienThe.kichCoId && item.conHang;
        }),
      });
    }
  });

  // =============================================
  // TẠO DANH SÁCH MÀU SẮC KHÔNG TRÙNG
  // =============================================

  const mauSacs = [];

  bienThes.forEach(function (bienThe) {
    if (!bienThe.mauSacId) {
      return;
    }

    const daTonTai = mauSacs.some(function (mauSac) {
      return mauSac.id === bienThe.mauSacId;
    });

    if (!daTonTai) {
      mauSacs.push({
        id: bienThe.mauSacId,

        ten: bienThe.tenMauSac,

        maHex: bienThe.maHex,

        conHang: bienThes.some(function (item) {
          return item.mauSacId === bienThe.mauSacId && item.conHang;
        }),
      });
    }
  });

  // =============================================
  // TÌM BIẾN THỂ ĐANG ĐƯỢC CHỌN
  // =============================================

  const bienTheDangChon = bienThes.find(function (bienThe) {
    const dungKichCo = kichCos.length === 0 || bienThe.kichCoId === kichCoId;

    const dungMauSac = mauSacs.length === 0 || bienThe.mauSacId === mauSacId;

    return dungKichCo && dungMauSac;
  });

  // =============================================
  // CHỌN KÍCH CỠ
  // =============================================

  function chonKichCo(id) {
    setKichCoId(id);

    const bienThesTheoKichCo = bienThes.filter(function (bienThe) {
      return bienThe.kichCoId === id;
    });

    // Ưu tiên màu đang chọn nếu còn biến thể tương ứng

    const bienTheTheoMau = bienThesTheoKichCo.find(function (bienThe) {
      return bienThe.mauSacId === mauSacId && bienThe.conHang;
    });

    // Nếu không có thì lấy biến thể còn hàng đầu tiên

    const bienTheMacDinh =
      bienTheTheoMau ||
      bienThesTheoKichCo.find(function (bienThe) {
        return bienThe.conHang;
      }) ||
      bienThesTheoKichCo[0];

    if (bienTheMacDinh) {
      setMauSacId(bienTheMacDinh.mauSacId || null);
    }
  }

  // =============================================
  // CHỌN MÀU SẮC
  // =============================================

  function chonMauSac(id) {
    setMauSacId(id);

    const bienThesTheoMau = bienThes.filter(function (bienThe) {
      return bienThe.mauSacId === id;
    });

    // Ưu tiên kích cỡ đang chọn nếu còn hàng

    const bienTheTheoKichCo = bienThesTheoMau.find(function (bienThe) {
      return bienThe.kichCoId === kichCoId && bienThe.conHang;
    });

    const bienTheMacDinh =
      bienTheTheoKichCo ||
      bienThesTheoMau.find(function (bienThe) {
        return bienThe.conHang;
      }) ||
      bienThesTheoMau[0];

    if (bienTheMacDinh) {
      setKichCoId(bienTheMacDinh.kichCoId || null);
    }
  }

  // =============================================
  // THÊM VÀO GIỎ HÀNG
  // =============================================

  async function xuLyThemVaoGioHang() {
    // Chưa đăng nhập
    if (!daDangNhap) {
      navigate("/dang-nhap", {
        state: {
          from: {
            pathname: location.pathname,
          },
        },
      });

      return;
    }

    // Kiểm tra quyền khách hàng
    if (!coVaiTro("khach_hang")) {
      setLoiGioHang("Chỉ tài khoản khách hàng mới được sử dụng giỏ hàng.");

      return;
    }

    // Kiểm tra biến thể
    if (!bienTheDangChon || !bienTheDangChon.conHang) {
      setLoiGioHang("Vui lòng chọn biến thể sản phẩm còn hàng.");

      return;
    }

    // Kiểm tra số lượng
    if (!Number.isInteger(Number(soLuongThem)) || Number(soLuongThem) < 1) {
      setLoiGioHang("Số lượng phải là số nguyên lớn hơn 0.");

      return;
    }

    setDangThemVaoGio(true);

    setLoiGioHang("");

    setThongBaoGioHang("");

    try {
      // Gửi ID biến thể và số lượng đến Backend

      const gioHangMoi = await themVaoGioHang(
        bienTheDangChon.id,

        Number(soLuongThem),
      );

      // Cập nhật CartContext

      capNhatGioHang(gioHangMoi);

      setThongBaoGioHang("Đã thêm sản phẩm vào giỏ hàng.");
    } catch (error) {
      setLoiGioHang(layThongBaoLoi(error));
    } finally {
      setDangThemVaoGio(false);
    }
  }

  // =============================================
  // LOADING
  // =============================================

  if (dangTai) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#030303] text-[#f0f0f5]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#00d9ff]"></div>

          <p className="mt-4 text-sm text-white/50">
            Đang tải thông tin sản phẩm...
          </p>
        </div>
      </main>
    );
  }

  // =============================================
  // LỖI HOẶC KHÔNG TÌM THẤY SẢN PHẨM
  // =============================================

  if (loi || !sanPham) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#030303] px-5 text-center text-[#f0f0f5]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00d9ff]">
          Product not found
        </p>

        <h1 className="mt-4 text-3xl font-semibold">Không tìm thấy sản phẩm</h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-white/50">
          {loi || "Sản phẩm có thể đã bị ẩn hoặc không còn được kinh doanh."}
        </p>

        <Link
          to="/san-pham"
          className="mt-7 rounded border border-[#00d9ff]/50 bg-[#00d9ff]/10 px-7 py-4 text-xs font-semibold uppercase tracking-widest text-[#00d9ff] transition-all hover:bg-[#00d9ff] hover:text-[#030303] hover:shadow-[0_0_25px_rgba(0,217,255,0.4)]"
        >
          Quay lại cửa hàng
        </Link>
      </main>
    );
  }

  // =============================================
  // GIÁ HIỂN THỊ
  // =============================================

  let hienThiGia = "";

  if (bienTheDangChon) {
    hienThiGia = dinhDangTienVietNam(bienTheDangChon.giaBan);
  } else if (sanPham.giaThapNhat === sanPham.giaCaoNhat) {
    hienThiGia = dinhDangTienVietNam(sanPham.giaThapNhat);
  } else {
    hienThiGia =
      dinhDangTienVietNam(sanPham.giaThapNhat) +
      " - " +
      dinhDangTienVietNam(sanPham.giaCaoNhat);
  }

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-[#f0f0f5]">
      {/* Ambient background glow orbs */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[rgba(0,217,255,0.08)] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[rgba(124,58,237,0.1)] blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        {/* BREADCRUMB */}

        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-white/40">
          <Link to="/" className="transition-colors hover:text-[#00d9ff]">
            Trang chủ
          </Link>

          <span>/</span>

          <Link to="/san-pham" className="transition-colors hover:text-[#00d9ff]">
            Sản phẩm
          </Link>

          <span>/</span>

          <span className="text-white/80">{sanPham.ten}</span>
        </div>

        {/* PRODUCT DETAIL */}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* =================================
                        THƯ VIỆN ẢNH
                    ================================= */}

          <section>
            {/* ẢNH LỚN */}

            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-[#0d0d14] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {anhDangChon ? (
                <img
                  src={anhDangChon}
                  alt={sanPham.ten}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/30">
                  Chưa có hình ảnh sản phẩm
                </div>
              )}
            </div>

            {/* ẢNH PHỤ */}

            {anhSanPhams.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {anhSanPhams.map(function (anh) {
                  const dangChon = anhDangChon === anh.duongDanAnh;

                  return (
                    <button
                      key={anh.id}
                      type="button"
                      onClick={() => setAnhDangChon(anh.duongDanAnh)}
                      className={`aspect-[3/4] overflow-hidden rounded-lg border-2 bg-[#0d0d14] transition-all duration-300 ${
                        dangChon
                          ? "border-[#00d9ff] shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                          : "border-white/10 opacity-60 hover:border-white/30 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={anh.duongDanAnh}
                        alt={anh.moTaAnh || sanPham.ten}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* =================================
                        THÔNG TIN SẢN PHẨM
                    ================================= */}

          <section className="rounded-2xl border border-white/10 bg-[#0d0d14]/70 p-8 backdrop-blur-xl lg:sticky lg:top-24 lg:self-start">
            {/* THƯƠNG HIỆU */}

            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00d9ff]">
              {sanPham.tenThuongHieu || "FashionStore"}
            </p>

            {/* TÊN */}

            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              {sanPham.ten}
            </h1>

            {/* DANH MỤC */}

            <p className="mt-2 text-xs uppercase tracking-widest text-white/40">
              Danh mục: <span className="text-white/70">{sanPham.tenDanhMuc}</span>
            </p>

            {/* GIÁ */}

            <div className="mt-6 border-y border-white/10 py-5">
              <p className="text-3xl font-extrabold text-[#00d9ff]">
                {hienThiGia}
              </p>

              {bienTheDangChon?.giaNiemYet &&
                bienTheDangChon.giaNiemYet > bienTheDangChon.giaBan && (
                  <p className="mt-2 text-sm text-white/40 line-through">
                    {dinhDangTienVietNam(bienTheDangChon.giaNiemYet)}
                  </p>
                )}
            </div>

            {/* CHẤT LIỆU VÀ ĐỐI TƯỢNG */}

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-4 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  Chất liệu
                </p>

                <p className="mt-1 font-medium text-white/80">
                  {sanPham.chatLieu || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  Đối tượng
                </p>

                <p className="mt-1 font-medium text-white/80">
                  {sanPham.doiTuong || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {/* KÍCH CỠ */}

            {kichCos.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                    Kích cỡ
                  </p>

                  <span className="text-xs text-white/40">Chọn kích cỡ</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {kichCos.map(function (kichCo) {
                    const dangChon = kichCoId === kichCo.id;

                    return (
                      <button
                        key={kichCo.id}
                        type="button"
                        disabled={!kichCo.conHang}
                        onClick={() => chonKichCo(kichCo.id)}
                        className={`min-w-12 rounded border px-4 py-3 text-xs font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-20 ${
                          dangChon
                            ? "border-[#00d9ff] bg-[#00d9ff]/15 text-[#00d9ff] shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                            : "border-white/15 bg-white/[0.03] text-white/70 hover:border-white/40 hover:text-white"
                        }`}
                      >
                        {kichCo.ten}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MÀU SẮC */}

            {mauSacs.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/80">
                  Màu sắc
                  {mauSacs.find(function (mauSac) {
                    return mauSac.id === mauSacId;
                  })?.ten && (
                    <span className="ml-2 font-normal text-[#00d9ff]">
                      —{" "}
                      {
                        mauSacs.find(function (mauSac) {
                          return mauSac.id === mauSacId;
                        }).ten
                      }
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap gap-3">
                  {mauSacs.map(function (mauSac) {
                    const dangChon = mauSacId === mauSac.id;

                    return (
                      <button
                        key={mauSac.id}
                        type="button"
                        title={mauSac.ten}
                        aria-label={mauSac.ten}
                        disabled={!mauSac.conHang}
                        onClick={() => chonMauSac(mauSac.id)}
                        className={`h-9 w-9 rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-20 ${
                          dangChon
                            ? "scale-110 border-[#00d9ff] ring-2 ring-[#00d9ff]/40 shadow-[0_0_15px_rgba(0,217,255,0.5)]"
                            : "border-white/30 hover:scale-110 hover:border-white"
                        }`}
                        style={{
                          backgroundColor: mauSac.maHex || "#cccccc",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* TÌNH TRẠNG BIẾN THỂ */}

            <div className="mt-6 border-t border-white/10 pt-5">
              {bienTheDangChon ? (
                bienTheDangChon.conHang ? (
                  <p className="text-sm font-medium text-emerald-400">
                    ✓ Sản phẩm còn hàng
                  </p>
                ) : (
                  <p className="text-sm font-medium text-red-400">
                    ✕ Biến thể này đã hết hàng
                  </p>
                )
              ) : (
                <p className="text-sm text-amber-400">
                  ⚠ Vui lòng chọn kích cỡ và màu sắc phù hợp.
                </p>
              )}
            </div>

            {/* SỐ LƯỢNG */}

            <div className="mt-6">
              <label
                htmlFor="soLuongThem"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/70"
              >
                Số lượng
              </label>

              <input
                id="soLuongThem"
                type="number"
                min="1"
                step="1"
                value={soLuongThem}
                onChange={function (event) {
                  const giaTri = event.target.value;

                  if (giaTri === "") {
                    setSoLuongThem("");
                    return;
                  }

                  const soLuong = Number(giaTri);

                  if (Number.isInteger(soLuong) && soLuong >= 1) {
                    setSoLuongThem(soLuong);
                  }
                }}
                onBlur={function () {
                  if (soLuongThem === "" || Number(soLuongThem) < 1) {
                    setSoLuongThem(1);
                  }
                }}
                className="w-28 rounded border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#00d9ff] focus:ring-1 focus:ring-[#00d9ff]"
              />
            </div>

            {/* LỖI */}

            {loiGioHang && (
              <div className="mt-4 rounded border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300 backdrop-blur-md">
                {loiGioHang}
              </div>
            )}

            {/* THÔNG BÁO THÀNH CÔNG */}

            {thongBaoGioHang && (
              <div className="mt-4 rounded border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300 backdrop-blur-md">
                {thongBaoGioHang}
              </div>
            )}

            {/* NÚT THÊM VÀO GIỎ HÀNG */}

            <button
              type="button"
              disabled={
                dangThemVaoGio || !bienTheDangChon || !bienTheDangChon.conHang
              }
              onClick={xuLyThemVaoGioHang}
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-[#00d9ff]/50 bg-gradient-to-r from-[#00d9ff]/20 via-[#7c3aed]/20 to-[#00d9ff]/20 px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#00d9ff] backdrop-blur-md transition-all duration-300 hover:border-[#00d9ff] hover:bg-[#00d9ff] hover:text-[#030303] hover:shadow-[0_0_30px_rgba(0,217,255,0.4)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/20 disabled:shadow-none"
            >
              {dangThemVaoGio ? "Đang thêm..." : "Thêm vào giỏ hàng"}

              {!dangThemVaoGio && (
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

            {/* XEM GIỎ HÀNG */}

            <Link
              to="/gio-hang"
              className="mt-5 block text-center text-xs font-semibold uppercase tracking-widest text-white/50 underline underline-offset-4 transition-colors hover:text-[#00d9ff]"
            >
              Xem giỏ hàng
            </Link>
          </section>
        </div>

        {/* MÔ TẢ SẢN PHẨM */}

        <section className="mt-20 rounded-2xl border border-white/10 bg-[#0d0d14]/70 p-8 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00d9ff]">
            Product information
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
            Mô tả sản phẩm
          </h2>

          <p className="mt-6 max-w-4xl whitespace-pre-line text-sm leading-8 text-white/70">
            {sanPham.moTa || "Sản phẩm chưa có mô tả."}
          </p>
        </section>
      </div>
    </main>
  );
}
