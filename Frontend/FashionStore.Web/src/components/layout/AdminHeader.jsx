import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, ShieldCheck, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function AdminHeader() {
  const navigate = useNavigate();
  const { nguoiDung, dangXuat } = useAuth();
  const [dangXuLyDangXuat, setDangXuLyDangXuat] = useState(false);

  async function xuLyDangXuat() {
    if (dangXuLyDangXuat) return;
    setDangXuLyDangXuat(true);
    try {
      await dangXuat();
      navigate("/dang-nhap", { replace: true });
    } finally {
      setDangXuLyDangXuat(false);
    }
  }

  return (
    <header className="admin-topbar sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 px-4 py-3 md:px-8">
      <div className="min-w-0">
        <p className="admin-overline"><span /> FASHIONSTORE / CONTROL ROOM</p>
        <h1 className="mt-1 font-display text-base font-bold tracking-tight text-white md:text-lg">Không gian quản trị</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="admin-role-pill hidden items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold text-purple-200 lg:flex">
          <ShieldCheck size={14} /> Quản trị viên
        </div>
        <div className="admin-user-chip hidden items-center gap-2.5 rounded-full px-2.5 py-1.5 sm:flex">
          <div className="admin-avatar"><UserRound size={16} /></div>
          <div className="max-w-[160px]">
            <p className="truncate text-[11px] font-semibold text-white">{nguoiDung?.hoTen || "Quản trị viên"}</p>
            <p className="truncate text-[10px] text-white/45">{nguoiDung?.email || ""}</p>
          </div>
        </div>
        <Link to="/" className="admin-header-action"><span className="hidden sm:inline">Xem Website</span><ExternalLink size={14} /></Link>
        <button type="button" onClick={xuLyDangXuat} disabled={dangXuLyDangXuat} className="admin-logout-button" title="Đăng xuất" aria-label="Đăng xuất">
          <LogOut size={15} /><span className="hidden md:inline">{dangXuLyDangXuat ? "Đang thoát..." : "Đăng xuất"}</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
