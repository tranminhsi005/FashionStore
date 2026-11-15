import { Link } from "react-router-dom";
import { dinhDangTienVietNam } from "../../utils/formatCurrency";
import { ArrowUpRight } from "lucide-react";

export default function ProductCard({ sanPham }) {
  const giaThapNhat = Number(sanPham.giaThapNhat || 0);
  const giaCaoNhat = Number(sanPham.giaCaoNhat || 0);

  let hienThiGia = "";
  if (giaThapNhat === giaCaoNhat) {
    hienThiGia = dinhDangTienVietNam(giaThapNhat);
  } else {
    hienThiGia =
      dinhDangTienVietNam(giaThapNhat) + " - " + dinhDangTienVietNam(giaCaoNhat);
  }

  return (
    <Link to={`/san-pham/${sanPham.slug}`} className="group block h-full">
      {/* REACTBITS STYLE CARD CONTAINER */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a14]/90 p-3 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]">
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#120f1e]">
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
            <div className="flex h-full items-center justify-center text-xs text-white/30">
              Chưa có hình ảnh
            </div>
          )}

          {/* BADGES */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {sanPham.noiBat && (
              <span className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider text-white shadow-[0_0_12px_rgba(168,85,247,0.8)]">
                FEATURED
              </span>
            )}

            {!sanPham.conHang && (
              <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-white/60 backdrop-blur-md">
                SOLD OUT
              </span>
            )}
          </div>

          {/* HOVER OVERLAY BUTTON (REACTBITS PILL) */}
          <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center justify-center gap-1.5 rounded-full border border-purple-400/50 bg-[#0c0a18]/90 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.5)] backdrop-blur-md">
              <span>Xem chi tiết</span>
              <ArrowUpRight size={13} className="text-purple-400" />
            </div>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-1 flex-col p-2.5 pt-3.5">
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-400/80">
            <span className="truncate">{sanPham.tenThuongHieu || "FashionStore"}</span>
            <span className="text-white/40">{sanPham.tenDanhMuc}</span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold text-white/90 transition-colors group-hover:text-purple-300">
            {sanPham.ten}
          </h3>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <p className="text-sm font-extrabold text-white">
              {hienThiGia}
            </p>
            <span
              className={`text-[10px] font-semibold ${
                sanPham.conHang ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {sanPham.conHang ? "● Còn hàng" : "○ Hết hàng"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
