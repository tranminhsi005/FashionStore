import { adminGet, adminPost, adminPut, adminDelete } from "./adminService";

// =============================================
// CẤU HÌNH API CỦA TỪNG LOẠI DỮ LIỆU
// =============================================

const CAC_ENDPOINT = {
  "danh-muc": {
    endpoint: "/danh-muc",
    params: {
      baoGomNgungHoatDong: true,
    },
  },

  "thuong-hieu": {
    endpoint: "/admin/thuong-hieu",
  },

  "kich-co": {
    endpoint: "/admin/kich-co",
  },

  "mau-sac": {
    endpoint: "/admin/mau-sac",
  },
};

// =============================================
// LẤY ENDPOINT
// =============================================

function layCauHinh(loai) {
  const cauHinh = CAC_ENDPOINT[loai];

  if (!cauHinh) {
    throw new Error("Loại danh mục không hợp lệ.");
  }

  return cauHinh;
}

// =============================================
// 1. LẤY DANH SÁCH
// =============================================

export async function layDanhSachCatalogAdmin(loai) {
  const cauHinh = layCauHinh(loai);

  return await adminGet(cauHinh.endpoint, {
    params: cauHinh.params || {},
  });
}

// =============================================
// 2. TẠO MỚI
// =============================================

export async function taoCatalogAdmin(loai, thongTin) {
  const cauHinh = layCauHinh(loai);

  return await adminPost(cauHinh.endpoint, thongTin);
}

// =============================================
// 3. CẬP NHẬT
// =============================================

export async function capNhatCatalogAdmin(loai, id, thongTin) {
  const cauHinh = layCauHinh(loai);

  return await adminPut(`${cauHinh.endpoint}/${id}`, thongTin);
}

// =============================================
// 4. NGỪNG HOẠT ĐỘNG
// =============================================

export async function ngungCatalogAdmin(loai, id) {
  const cauHinh = layCauHinh(loai);

  return await adminDelete(`${cauHinh.endpoint}/${id}`);
}
