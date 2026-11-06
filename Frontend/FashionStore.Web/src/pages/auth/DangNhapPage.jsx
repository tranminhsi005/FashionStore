import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import { layThongBaoLoi } from "../../utils/apiError";

export default function DangNhapPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { dangNhap } = useAuth();

  const [email, setEmail] = useState("");

  const [matKhau, setMatKhau] = useState("");

  const [hienMatKhau, setHienMatKhau] = useState(false);

  const [loi, setLoi] = useState("");

  const [dangGui, setDangGui] = useState(false);

  // Thông báo được chuyển từ trang đăng ký
  const thongBao = location.state?.message;

  async function xuLySubmit(event) {
    event.preventDefault();

    setLoi("");

    setDangGui(true);

    try {
      await dangNhap(email, matKhau);

      // Nếu người dùng trước đó bị chuyển đến trang đăng nhập
      // thì quay lại trang cũ.
      const duongDanQuayLai = location.state?.from?.pathname || "/";

      navigate(duongDanQuayLai, {
        replace: true,
      });
    } catch (error) {
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangGui(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-2">
        {/* BÊN TRÁI: FORM ĐĂNG NHẬP */}

        <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-20">
          {/* Logo */}

          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-lg font-black tracking-[0.2em]"
          >
            FASHIONSTORE
            <span className="h-2 w-2 rounded-full bg-black"></span>
          </Link>

          {/* Nội dung form */}

          <div className="mx-auto my-auto w-full max-w-md py-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Welcome back
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Đăng nhập
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              Đăng nhập để tiếp tục khám phá và mua sắm những sản phẩm thời
              trang yêu thích.
            </p>

            {/* Thông báo đăng ký thành công */}

            {thongBao && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {thongBao}
              </div>
            )}

            {/* Lỗi */}

            {loi && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {loi}
              </div>
            )}

            {/* Form */}

            <form onSubmit={xuLySubmit} className="mt-10 space-y-6">
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  required
                  className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                />
              </div>

              {/* Mật khẩu */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="matKhau" className="text-sm font-medium">
                    Mật khẩu
                  </label>
                </div>

                <div className="flex items-center border-b border-gray-300 transition-colors focus-within:border-black">
                  <input
                    id="matKhau"
                    type={hienMatKhau ? "text" : "password"}
                    value={matKhau}
                    onChange={(event) => setMatKhau(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setHienMatKhau(!hienMatKhau)}
                    className="text-xs text-gray-500 hover:text-black"
                  >
                    {hienMatKhau ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              {/* Nút đăng nhập */}

              <button
                type="submit"
                disabled={dangGui}
                className="group flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {dangGui ? "Đang đăng nhập..." : "Đăng nhập"}

                {!dangGui && (
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            {/* Đăng ký */}

            <p className="mt-8 text-center text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <Link
                to="/dang-ky"
                className="font-semibold text-black underline underline-offset-4"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <p className="text-xs text-gray-400">
            © 2026 FASHIONSTORE. ALL RIGHTS RESERVED.
          </p>
        </section>

        {/* BÊN PHẢI: HÌNH ẢNH THỜI TRANG */}

        <section className="relative hidden overflow-hidden bg-[#171717] lg:block">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=85"
            alt="Fashion editorial"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>

          <div className="absolute bottom-16 left-14 right-14 text-white">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/70">
              Discover your style
            </p>

            <h2 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight">
              Wear your identity.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              Phong cách không chỉ là những gì bạn mặc, mà còn là cách bạn thể
              hiện chính mình.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
