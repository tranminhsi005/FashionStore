export function dinhDangTienVietNam(gia) {
  if (gia === null || gia === undefined) {
    return "Liên hệ";
  }

  return Number(gia).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
