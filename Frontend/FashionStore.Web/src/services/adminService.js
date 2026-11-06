import axiosClient from "../api/axiosClient";

// =============================================
// CHUẨN HÓA RESPONSE
// Hỗ trợ cả { success, data } và response trực tiếp.
// =============================================

function layDuLieu(response) {
  if (!response || response.status === 204) {
    return null;
  }

  return response.data?.data ?? response.data ?? null;
}

// =============================================
// GET
// =============================================

export async function adminGet(endpoint, cauHinh = {}) {
  const response = await axiosClient.get(endpoint, cauHinh);

  return layDuLieu(response);
}

// =============================================
// POST
// =============================================

export async function adminPost(endpoint, duLieu, cauHinh = {}) {
  const response = await axiosClient.post(endpoint, duLieu, cauHinh);

  return layDuLieu(response);
}

// =============================================
// PUT
// =============================================

export async function adminPut(endpoint, duLieu, cauHinh = {}) {
  const response = await axiosClient.put(endpoint, duLieu, cauHinh);

  return layDuLieu(response);
}

// =============================================
// PATCH
// =============================================

export async function adminPatch(endpoint, duLieu, cauHinh = {}) {
  const response = await axiosClient.patch(endpoint, duLieu, cauHinh);

  return layDuLieu(response);
}

// =============================================
// DELETE
// =============================================

export async function adminDelete(endpoint, cauHinh = {}) {
  const response = await axiosClient.delete(endpoint, cauHinh);

  return layDuLieu(response);
}
