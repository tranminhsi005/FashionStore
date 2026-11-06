let accessToken = null;

let xuLyHetPhien = null;

// Lấy access token
export function layAccessToken() {
  return accessToken;
}

// Lưu access token
export function datAccessToken(token) {
  accessToken = token;
}

// Xóa access token
export function xoaAccessToken() {
  accessToken = null;
}

// Kiểm tra đã có access token hay chưa
export function coAccessToken() {
  return accessToken !== null;
}

// Đăng ký hàm xử lý khi phiên hết hạn
export function datXuLyHetPhien(callback) {
  xuLyHetPhien = callback;

  return function huyDangKy() {
    if (xuLyHetPhien === callback) {
      xuLyHetPhien = null;
    }
  };
}

// Thông báo phiên đăng nhập hết hạn
export function thongBaoHetPhien() {
  if (typeof xuLyHetPhien === "function") {
    xuLyHetPhien();
  }
}
