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
      {/* HÌNH ẢNH */}

      <div className="relative aspect-[3/4] overflow-hidden bg-[#eae8e2]">
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
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Chưa có hình ảnh
          </div>
        )}

        {/* BADGE */}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {sanPham.noiBat && (
            <span className="bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              Featured
            </span>
          )}

          {!sanPham.conHang && (
            <span className="bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black">
              Sold out
            </span>
          )}
        </div>

        {/* OVERLAY */}

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white transition-transform duration-300 group-hover:translate-y-0">
          Xem chi tiết
        </div>
      </div>

      {/* THÔNG TIN */}

      <div className="pt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            {sanPham.tenThuongHieu || "FashionStore"}
          </p>

          <span className="shrink-0 text-[10px] text-gray-400">
            {sanPham.tenDanhMuc}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#171717] transition-colors group-hover:text-gray-500">
          {sanPham.ten}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-black">{hienThiGia}</p>

          <span className="text-xs text-gray-400">
            {sanPham.conHang ? "Còn hàng" : "Hết hàng"}
          </span>
        </div>
      </div>
    </Link>
  );
}
