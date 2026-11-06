// Lấy thông báo lỗi từ Axios response
export function layThongBaoLoi(error) {
  // Không nhận được response từ backend
  if (!error.response) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối.";
  }

  const data = error.response.data;

  // Backend có thể trả về các định dạng khác nhau.
  if (typeof data === "string") {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.title) {
    return data.title;
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.errors) {
    const firstError = Object.values(data.errors)[0];

    if (Array.isArray(firstError)) {
      return firstError[0];
    }
  }

  switch (error.response.status) {
    case 400:
      return "Dữ liệu gửi lên không hợp lệ.";

    case 401:
      return "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.";

    case 403:
      return "Bạn không có quyền thực hiện thao tác này.";

    case 404:
      return "Không tìm thấy dữ liệu yêu cầu.";

    case 409:
      return "Dữ liệu đang bị xung đột.";

    case 500:
      return "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.";

    default:
      return "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
}
