import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06060a] text-[#f0f0f5] lg:flex">
      {/* Background Dot Grid Effect (ReactBits Style) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle Ambient Glows */}
      <div className="pointer-events-none fixed -top-40 right-10 z-0 h-[500px] w-[500px] rounded-full bg-[rgba(0,217,255,0.06)] blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 left-10 z-0 h-[600px] w-[600px] rounded-full bg-[rgba(124,58,237,0.07)] blur-[160px]" />

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="relative z-10 min-w-0 flex-1">
        <AdminHeader />

        <main className="p-4 md:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
