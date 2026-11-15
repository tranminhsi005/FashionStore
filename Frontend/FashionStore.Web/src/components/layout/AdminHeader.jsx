import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, ShieldCheck, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function AdminHeader() {
  const navigate = useNavigate();
  const { nguoiDung, dangXuat } = useAuth();
  const [dangXuLyDangXuat, setDangXuLyDangXuat] = useState(false);

  // =============================================
  // ĐĂNG XUẤT
  // =============================================

  async function xuLyDangXuat() {
    if (dangXuLyDangXuat) {
      return;
    }

    setDangXuLyDangXuat(true);

    try {
      await dangXuat();
      navigate("/dang-nhap", {
        replace: true,
      });
    } finally {
      setDangXuLyDangXuat(false);
    }
  }

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-white/10 bg-[#08080e]/80 px-4 py-3 backdrop-blur-2xl md:px-8">
      {/* LEFT */}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00d9ff]">
          FASHIONSTORE CONTROL PANEL
        </p>

        <h1 className="mt-1 font-display text-base font-extrabold tracking-tight text-white md:text-lg">
          Không gian quản trị
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* ADMIN ROLE */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 lg:flex">
          <ShieldCheck size={14} />
          <span>Root Admin</span>
        </div>

        {/* ADMIN INFORMATION */}
        <div className="hidden items-center gap-3 border-l border-white/10 pl-4 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00d9ff]/30 bg-[#00d9ff]/10 text-[#00d9ff] shadow-[0_0_12px_rgba(0,217,255,0.2)]">
            <UserRound size={17} />
          </div>

          <div className="max-w-[180px]">
            <p className="truncate text-xs font-bold text-white">
              {nguoiDung?.hoTen || "Quản trị viên"}
            </p>

            <p className="truncate text-[10px] text-white/40">
              {nguoiDung?.email || ""}
            </p>
          </div>
        </div>

        {/* RETURN TO WEBSITE */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-white/80 transition-all hover:border-[#00d9ff]/50 hover:bg-[#00d9ff]/10 hover:text-[#00d9ff] hover:shadow-[0_0_20px_rgba(0,217,255,0.2)]"
        >
          <span className="hidden sm:inline">Xem Website</span>
          <ExternalLink size={14} />
        </Link>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={xuLyDangXuat}
          disabled={dangXuLyDangXuat}
          title="Đăng xuất"
          aria-label="Đăng xuất khỏi khu vực quản trị"
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/20 px-3.5 py-2 text-xs font-semibold text-red-400 transition-all hover:border-red-500 hover:bg-red-900/40 hover:text-red-200 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut size={15} />

          <span className="hidden md:inline">
            {dangXuLyDangXuat ? "Đang thoát..." : "Đăng xuất"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
