import { Routes, Route } from "react-router-dom";

// =============================================
// LAYOUT
// =============================================

import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";

// =============================================
// AUTHENTICATION
// =============================================

import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// =============================================
// PUBLIC PAGES
// =============================================

import HomePage from "./pages/public/HomePage";
import ProductsPage from "./pages/public/ProductsPage";
import ProductDetailPage from "./pages/public/ProductDetailPage";

// =============================================
// AUTHENTICATION PAGES
// =============================================

import DangNhapPage from "./pages/auth/DangNhapPage";
import DangKyPage from "./pages/auth/DangKyPage";

// =============================================
// CUSTOMER PAGES
// =============================================

import CartPage from "./pages/public/CartPage";
import AddressPage from "./pages/public/AddressPage";
import CheckoutPage from "./pages/public/CheckoutPage";
import OrdersPage from "./pages/public/OrdersPage";
import OrderDetailPage from "./pages/public/OrderDetailPage";
import AccountPage from "./pages/public/AccountPage";

// =============================================
// ADMIN PAGES
// =============================================

import DashboardPage from "./pages/admin/DashboardPage";
import AdminModulePreviewPage from "./pages/admin/AdminModulePreviewPage";

import AdminProductsPage from "./pages/admin/products/AdminProductsPage";
import AdminProductFormPage from "./pages/admin/products/AdminProductFormPage";
import AdminProductDetailPage from "./pages/admin/products/AdminProductDetailPage";

import AdminCatalogPage from "./pages/admin/catalog/AdminCatalogPage";

import AdminInventoryPage from "./pages/admin/inventory/AdminInventoryPage";
import AdminInventoryDetailPage from "./pages/admin/inventory/AdminInventoryDetailPage";

// =============================================
import AdminOrdersPage from "./pages/admin/orders/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/admin/orders/AdminOrderDetailPage";
// =============================================
// COMMON
// =============================================

import NotFoundPage from "./pages/NotFoundPage";

// =============================================
// APP
// =============================================

function App() {
  return (
    <Routes>
      {/* =====================================
          CUSTOMER WEBSITE
      ===================================== */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/san-pham" element={<ProductsPage />} />

        <Route path="/san-pham/:slug" element={<ProductDetailPage />} />

        {/* =================================
            CUSTOMER AUTHENTICATED ROUTES
        ================================= */}

        <Route element={<ProtectedRoute requiredRoles={["khach_hang"]} />}>
          <Route path="/gio-hang" element={<CartPage />} />

          <Route path="/dia-chi" element={<AddressPage />} />

          <Route path="/thanh-toan" element={<CheckoutPage />} />

          <Route path="/don-hang" element={<OrdersPage />} />

          <Route path="/don-hang/:id" element={<OrderDetailPage />} />

          <Route path="/tai-khoan" element={<AccountPage />} />
        </Route>
      </Route>

      {/* =====================================
          GUEST ROUTES
      ===================================== */}

      <Route element={<GuestRoute />}>
        <Route path="/dang-nhap" element={<DangNhapPage />} />

        <Route path="/dang-ky" element={<DangKyPage />} />
      </Route>

      {/* =====================================
          ADMIN ROUTES
          Chỉ quan_tri_vien
      ===================================== */}

      <Route element={<ProtectedRoute requiredRoles={["quan_tri_vien"]} />}>
        <Route path="/admin-preview" element={<AdminLayout />}>
          {/* DASHBOARD */}

          <Route index element={<DashboardPage />} />

          {/* =================================
              QUẢN LÝ SẢN PHẨM
          ================================= */}

          <Route path="san-pham" element={<AdminProductsPage />} />

          <Route path="san-pham/them" element={<AdminProductFormPage />} />

          <Route path="san-pham/:id" element={<AdminProductDetailPage />} />

          <Route
            path="san-pham/:id/chinh-sua"
            element={<AdminProductFormPage />}
          />

          {/* =================================
              QUẢN LÝ DANH MỤC
          ================================= */}

          <Route
            path="danh-muc"
            element={<AdminCatalogPage loai="danh-muc" />}
          />

          {/* =================================
              QUẢN LÝ THƯƠNG HIỆU
          ================================= */}

          <Route
            path="thuong-hieu"
            element={<AdminCatalogPage loai="thuong-hieu" />}
          />

          {/* =================================
              QUẢN LÝ KÍCH CỠ
          ================================= */}

          <Route path="kich-co" element={<AdminCatalogPage loai="kich-co" />} />

          {/* =================================
              QUẢN LÝ MÀU SẮC
          ================================= */}

          <Route path="mau-sac" element={<AdminCatalogPage loai="mau-sac" />} />

          <Route path="ton-kho" element={<AdminInventoryPage />} />

          <Route
            path="ton-kho/:bienTheId"
            element={<AdminInventoryDetailPage />}
          />

          {/* Quản lý đơn hàng */}
          <Route path="don-hang" element={<AdminOrdersPage />} />

          {/* Chi tiết đơn hàng */}
          <Route path="don-hang/:id" element={<AdminOrderDetailPage />} />

          {/* Quản lý vận chuyển */}
          <Route
            path="van-chuyen"
            element={<AdminOrdersPage cheDoVanChuyen={true} />}
          />

          {/* =================================
              MODULE CHƯA TRIỂN KHAI
          ================================= */}

          <Route path="*" element={<AdminModulePreviewPage />} />
        </Route>
      </Route>

      {/* =====================================
          404 NOT FOUND
      ===================================== */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
