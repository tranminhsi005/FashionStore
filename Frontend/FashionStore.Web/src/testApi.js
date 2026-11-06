import productService from "./services/productService";

import { layThongBaoLoi } from "./utils/apiError";

async function kiemTraSanPham() {
  try {
    const result = await productService.layDanhSachSanPham({
      trang: 1,
      kichThuocTrang: 10,
    });

    console.log("Danh sách sản phẩm:", result);
  } catch (error) {
    console.log("Lỗi:", layThongBaoLoi(error));
  }
}

kiemTraSanPham();
