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
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur-md md:px-8">
      {/* LEFT */}

      <div className="min-w-0">
        <p className="text-xs text-muted">FashionStore</p>

        <h1 className="mt-1 font-display text-sm font-bold md:text-base">
          Không gian quản trị
        </h1>
      </div>

      {/* RIGHT */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* ADMIN ROLE */}

        <div className="hidden items-center gap-2 text-xs text-muted lg:flex">
          <ShieldCheck size={16} />

          <span>Administration</span>
        </div>

        {/* ADMIN INFORMATION */}

        <div className="hidden items-center gap-3 border-l border-line pl-4 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-dark">
            <UserRound size={17} />
          </div>

          <div className="max-w-[180px]">
            <p className="truncate text-xs font-semibold">
              {nguoiDung?.hoTen || "Quản trị viên"}
            </p>

            <p className="truncate text-[10px] text-muted">
              {nguoiDung?.email || ""}
            </p>
          </div>
        </div>

        {/* RETURN TO WEBSITE */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-control border border-line px-3 py-2 text-xs font-semibold transition hover:border-ink"
        >
          <span className="hidden sm:inline">Website</span>

          <ExternalLink size={14} />
        </Link>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={xuLyDangXuat}
          disabled={dangXuLyDangXuat}
          title="Đăng xuất"
          aria-label="Đăng xuất khỏi khu vực quản trị"
          className="inline-flex items-center gap-2 rounded-control border border-line px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
