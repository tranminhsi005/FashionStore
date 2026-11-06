import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";

import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-paper-dark lg:flex">
      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <div className="min-w-0 flex-1">
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
