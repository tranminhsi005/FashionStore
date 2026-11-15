import { Link } from "react-router-dom";

import { dinhDangTienVietNam } from "../../utils/formatCurrency";

export default function ProductCard({ sanPham }) {
  const giaThapNhat = Number(sanPham.giaThapNhat || 0);

  const giaCaoNhat = Number(sanPham.giaCaoNhat || 0);

  let hienThiGia = "";

  if (giaThapNhat === giaCaoNhat) {
    hienThiGia = dinhDangTienVietNam(giaThapNhat);
  } else {
    hienThiGia =
      dinhDangTienVietNam(giaThapNhat) +
      " - " +
      dinhDangTienVietNam(giaCaoNhat);
  }

  return (
    <Link to={`/san-pham/${sanPham.slug}`} className="group block">
      {/* CONTAINER */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          transition: "all 0.4s",
          borderRadius: "4px",
          overflow: "hidden",
        }}
        className="group-hover:[border-color:rgba(0,217,255,0.3)] group-hover:[box-shadow:0_0_25px_rgba(0,217,255,0.1)]"
      >
        {/* HÌNH ẢNH */}

        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "3/4", background: "#0d0d14" }}
        >
          {sanPham.duongDanAnhChinh ? (
            <img
              src={sanPham.duongDanAnhChinh}
              alt={sanPham.ten}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              className="flex h-full items-center justify-center text-sm"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Chưa có hình ảnh
            </div>
          )}

          {/* BADGE */}

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {sanPham.noiBat && (
              <span
                className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  background: "#00d9ff",
                  color: "#0d0d14",
                  borderRadius: "2px",
                }}
              >
                FEATURED
              </span>
            )}

            {!sanPham.conHang && (
              <span
                className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "2px",
                }}
              >
                SOLD OUT
              </span>
            )}
          </div>

          {/* OVERLAY */}

          <div
            className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center px-4 py-4 text-center text-xs font-semibold uppercase tracking-widest transition-transform duration-300 group-hover:translate-y-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
              color: "#00d9ff",
              textShadow: "0 0 12px rgba(0,217,255,0.8)",
              letterSpacing: "0.2em",
            }}
          >
            XEM CHI TIẾT
          </div>
        </div>

        {/* THÔNG TIN */}

        <div className="px-4 pb-4 pt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p
              className="truncate text-[10px] font-semibold uppercase"
              style={{
                color: "#00d9ff",
                letterSpacing: "0.2em",
              }}
            >
              {sanPham.tenThuongHieu || "FashionStore"}
            </p>

            <span
              className="shrink-0 text-[10px]"
              style={{ color: "rgba(240,240,245,0.4)" }}
            >
              {sanPham.tenDanhMuc}
            </span>
          </div>

          <h3
            className="line-clamp-2 min-h-10 text-sm font-medium leading-5 transition-colors"
            style={{ color: "rgba(240,240,245,0.9)" }}
          >
            {sanPham.ten}
          </h3>

          <div className="mt-3 flex items-center justify-between gap-2">
            <p
              className="text-sm font-semibold"
              style={{ color: "#ffffff" }}
            >
              {hienThiGia}
            </p>

            <span
              className="text-xs"
              style={{ color: "rgba(240,240,245,0.4)" }}
            >
              {sanPham.conHang ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
