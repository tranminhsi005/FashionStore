import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Construction, Sparkles } from "lucide-react";
import { Reveal, SpotlightCard } from "../../components/ui";

const moduleNames = {
  "san-pham": "Quản lý sản phẩm",
  "danh-muc": "Quản lý danh mục",
  "thuong-hieu": "Quản lý thương hiệu",
  "ton-kho": "Quản lý tồn kho",
  "don-hang": "Quản lý đơn hàng",
  "van-chuyen": "Quản lý vận chuyển",
};

function AdminModulePreviewPage() {
  const location = useLocation();
  const moduleKey = location.pathname.split("/").pop();
  const moduleName = moduleNames[moduleKey] || "Module quản trị";

  return (
    <div className="space-y-8">
      <Reveal>
        <p className="eyebrow">ADMIN / MODULE PREVIEW</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] text-white md:text-4xl">
          {moduleName}<span className="text-purple-300">.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
          Khu vực này đang được chuẩn bị cho các bước phát triển tiếp theo của FashionStore Studio.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <SpotlightCard className="flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center md:px-12">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-purple-200/20 bg-purple-200/10 text-purple-200">
            <Construction size={24} />
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-200/70">
            <Sparkles size={13} /> Module đang phát triển
          </p>
          <h2 className="mt-3 text-xl font-bold text-white">Chức năng chưa được triển khai</h2>
          <p className="mt-2 max-w-md text-xs leading-6 text-white/45">
            Đây là màn hình xem trước điều hướng. Hiện chưa có dữ liệu hoặc thao tác nghiệp vụ trong module này.
          </p>
          <Link
            to="/admin-preview"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-5 py-3 text-xs font-semibold text-white/75 transition hover:border-purple-200/30 hover:bg-purple-200/10 hover:text-white"
          >
            <ArrowLeft size={15} /> Về tổng quan quản trị <ArrowUpRight size={14} />
          </Link>
        </SpotlightCard>
      </Reveal>
    </div>
  );
}

export default AdminModulePreviewPage;
