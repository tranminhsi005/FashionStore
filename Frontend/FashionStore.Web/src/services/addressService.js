import axiosClient from "../api/axiosClient";

// Lấy dữ liệu được bọc trong data nếu có
function layDuLieu(response) {
  return response.data?.data ?? response.data;
}

// =============================================
// 1. LẤY DANH SÁCH ĐỊA CHỈ
// GET /dia-chi
// =============================================

export async function layDanhSachDiaChi() {
  const response = await axiosClient.get("/dia-chi");

  return layDuLieu(response);
}

// =============================================
// 2. THÊM ĐỊA CHỈ
// POST /dia-chi
// =============================================

export async function themDiaChi(thongTin) {
  const response = await axiosClient.post("/dia-chi", thongTin);

  return layDuLieu(response);
}

// =============================================
// 3. CẬP NHẬT ĐỊA CHỈ
// PUT /dia-chi/{id}
// =============================================

export async function capNhatDiaChi(id, thongTin) {
  const response = await axiosClient.put(`/dia-chi/${id}`, thongTin);

  return layDuLieu(response);
}

// =============================================
// 4. ĐẶT ĐỊA CHỈ MẶC ĐỊNH
// PUT /dia-chi/{id}/mac-dinh
// =============================================

export async function datDiaChiMacDinh(id) {
  const response = await axiosClient.put(`/dia-chi/${id}/mac-dinh`);

  return layDuLieu(response);
}

// =============================================
// 5. XÓA ĐỊA CHỈ
// DELETE /dia-chi/{id}
// =============================================

export async function xoaDiaChi(id) {
  const response = await axiosClient.delete(`/dia-chi/${id}`);

  return layDuLieu(response);
}
