import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { GlowOrb, PageMotion } from "../ui";

function AdminLayout() {
  return (
    <div className="admin-shell relative min-h-screen overflow-x-clip bg-void text-white lg:flex">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <GlowOrb color="purple" size={580} opacity={0.11} top="-320px" right="-180px" />
        <GlowOrb color="cyan" size={500} opacity={0.055} bottom="-300px" left="20%" />
      </div>
      <div className="relative z-10"><AdminSidebar /></div>
      <div className="relative z-10 min-w-0 flex-1">
        <AdminHeader />
        <main className="admin-content p-4 md:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <PageMotion><Outlet /></PageMotion>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
