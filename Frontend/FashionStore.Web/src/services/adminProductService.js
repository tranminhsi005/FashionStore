import {
  adminGet,
  adminPost,
  adminPut,
  adminPatch,
  adminDelete,
} from "./adminService";

// =============================================
// 1. DANH SÁCH SẢN PHẨM ADMIN
// GET /admin/san-pham?tuKhoa=
// =============================================

export async function layDanhSachSanPhamAdmin(tuKhoa = "") {
  const params = {};

  if (tuKhoa.trim()) {
    params.tuKhoa = tuKhoa.trim();
  }

  return await adminGet("/admin/san-pham", {
    params: params,
  });
}

// =============================================
// 2. CHI TIẾT SẢN PHẨM
// GET /admin/san-pham/{id}
// =============================================

export async function layChiTietSanPhamAdmin(id) {
  return await adminGet(`/admin/san-pham/${id}`);
}

// =============================================
// 3. TẠO SẢN PHẨM
// POST /admin/san-pham
// =============================================

export async function taoSanPhamAdmin(thongTin) {
  return await adminPost("/admin/san-pham", thongTin);
}

// =============================================
// 4. CẬP NHẬT SẢN PHẨM
// PUT /admin/san-pham/{id}
// =============================================

export async function capNhatSanPhamAdmin(id, thongTin) {
  return await adminPut(`/admin/san-pham/${id}`, thongTin);
}

// =============================================
// 5. CẬP NHẬT TRẠNG THÁI SẢN PHẨM
// PATCH /admin/san-pham/{id}/trang-thai
// =============================================

export async function capNhatTrangThaiSanPhamAdmin(id, trangThai) {
  return await adminPatch(`/admin/san-pham/${id}/trang-thai`, {
    trangThai: trangThai,
  });
}

// =============================================
// 6. THÊM BIẾN THỂ
// POST /admin/san-pham/{id}/bien-the
// =============================================

export async function themBienTheAdmin(sanPhamId, thongTin) {
  return await adminPost(`/admin/san-pham/${sanPhamId}/bien-the`, thongTin);
}

// =============================================
// 7. CẬP NHẬT BIẾN THỂ
// PUT /admin/bien-the/{id}
// =============================================

export async function capNhatBienTheAdmin(bienTheId, thongTin) {
  return await adminPut(`/admin/bien-the/${bienTheId}`, thongTin);
}

// =============================================
// 8. NGỪNG KINH DOANH BIẾN THỂ
// DELETE /admin/bien-the/{id}
// =============================================

export async function ngungBienTheAdmin(bienTheId) {
  return await adminDelete(`/admin/bien-the/${bienTheId}`);
}

// =============================================
// 9. LẤY DANH SÁCH DANH MỤC ĐANG HOẠT ĐỘNG
// GET /danh-muc
// =============================================

export async function layDanhSachDanhMucAdmin() {
  return await adminGet("/danh-muc");
}

// =============================================
// 10. LẤY DANH SÁCH THƯƠNG HIỆU
// GET /admin/thuong-hieu
// =============================================

export async function layDanhSachThuongHieuAdmin() {
  return await adminGet("/admin/thuong-hieu");
}

// =============================================
// 11. LẤY DANH SÁCH KÍCH CỠ
// GET /admin/kich-co
// =============================================

export async function layDanhSachKichCoAdmin() {
  return await adminGet("/admin/kich-co");
}

// =============================================
// 12. LẤY DANH SÁCH MÀU SẮC
// GET /admin/mau-sac
// =============================================

export async function layDanhSachMauSacAdmin() {
  return await adminGet("/admin/mau-sac");
}
