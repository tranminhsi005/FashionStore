import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { dinhDangTienVietNam } from "../../utils/formatCurrency";

export default function ProductCard({ sanPham }) {
  const reduceMotion = useReducedMotion();
  const giaThapNhat = Number(sanPham.giaThapNhat || 0);
  const giaCaoNhat = Number(sanPham.giaCaoNhat || 0);
  const hienThiGia = giaThapNhat === giaCaoNhat
    ? dinhDangTienVietNam(giaThapNhat)
    : `${dinhDangTienVietNam(giaThapNhat)} – ${dinhDangTienVietNam(giaCaoNhat)}`;

  return (
    <Link to={`/san-pham/${sanPham.slug}`} className="group block h-full">
      <motion.article
        whileHover={reduceMotion ? undefined : { y: -6 }}
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
        className="product-card flex h-full flex-col"
      >
        <div className="product-card-media">
          {sanPham.duongDanAnhChinh ? (
            <img
              src={sanPham.duongDanAnhChinh}
              alt={sanPham.ten}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
              onError={(event) => { event.currentTarget.style.opacity = "0"; }}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/25">
              <ImageOff size={24} strokeWidth={1.3} />
              <span className="text-[10px] uppercase tracking-[0.18em]">Chưa có hình ảnh</span>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {sanPham.noiBat && <span className="product-badge product-badge-featured">FEATURED</span>}
            {!sanPham.conHang && <span className="product-badge">SOLD OUT</span>}
          </div>

          <span className="product-card-open"><span>Xem chi tiết</span><ArrowUpRight size={14} /></span>
        </div>

        <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
          <div className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-200/65">
            <span className="truncate">{sanPham.tenThuongHieu || "FashionStore"}</span>
            <span className="truncate text-white/35">{sanPham.tenDanhMuc}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-white/90 transition-colors group-hover:text-purple-200">
            {sanPham.ten}
          </h3>
          <div className="mt-auto flex items-end justify-between gap-2 pt-4">
            <p className="text-sm font-bold tracking-tight text-white">{hienThiGia}</p>
            <span className={`shrink-0 text-[10px] font-medium ${sanPham.conHang ? "text-emerald-300/80" : "text-rose-300/80"}`}>
              {sanPham.conHang ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
