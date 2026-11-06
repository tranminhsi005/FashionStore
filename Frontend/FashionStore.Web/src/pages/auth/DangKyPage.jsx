import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import { layThongBaoLoi } from "../../utils/apiError";

export default function DangKyPage() {
  const navigate = useNavigate();

  const { dangKy } = useAuth();

  const [hoTen, setHoTen] = useState("");

  const [email, setEmail] = useState("");

  const [soDienThoai, setSoDienThoai] = useState("");

  const [matKhau, setMatKhau] = useState("");

  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");

  const [hienMatKhau, setHienMatKhau] = useState(false);

  const [loi, setLoi] = useState("");

  const [dangGui, setDangGui] = useState(false);

  async function xuLySubmit(event) {
    event.preventDefault();

    setLoi("");

    // Kiểm tra họ tên
    if (hoTen.trim().length < 2) {
      setLoi("Họ tên phải có ít nhất 2 ký tự.");
      return;
    }

    // Kiểm tra mật khẩu
    if (matKhau.length < 8) {
      setLoi("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (matKhau !== xacNhanMatKhau) {
      setLoi("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setDangGui(true);

    try {
      await dangKy({
        hoTen: hoTen.trim(),
        email: email.trim(),
        matKhau: matKhau,
        soDienThoai: soDienThoai.trim(),
      });

      // Đăng ký thành công, chuyển đến đăng nhập
      navigate("/dang-nhap", {
        replace: true,
        state: {
          message: "Đăng ký tài khoản thành công. Hãy đăng nhập để tiếp tục.",
        },
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
        {/* BÊN TRÁI: HÌNH ẢNH */}

        <section className="relative hidden overflow-hidden bg-[#171717] lg:block">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85"
            alt="Fashion shopping"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>

          <div className="absolute bottom-16 left-14 right-14 text-white">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/70">
              Join our community
            </p>

            <h2 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight">
              A new chapter of style.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              Tạo tài khoản để khám phá bộ sưu tập và trải nghiệm mua sắm tại
              FashionStore.
            </p>
          </div>
        </section>

        {/* BÊN PHẢI: FORM */}

        <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-20">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-lg font-black tracking-[0.2em]"
          >
            FASHIONSTORE
            <span className="h-2 w-2 rounded-full bg-black"></span>
          </Link>

          <div className="mx-auto my-auto w-full max-w-md py-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Create your account
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Đăng ký
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              Tạo tài khoản FashionStore để bắt đầu trải nghiệm mua sắm.
            </p>

            {/* Lỗi */}

            {loi && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {loi}
              </div>
            )}

            <form onSubmit={xuLySubmit} className="mt-8 space-y-5">
              {/* Họ tên */}

              <div>
                <label
                  htmlFor="hoTen"
                  className="mb-2 block text-sm font-medium"
                >
                  Họ và tên
                </label>

                <input
                  id="hoTen"
                  type="text"
                  value={hoTen}
                  onChange={(event) => setHoTen(event.target.value)}
                  minLength={2}
                  maxLength={150}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  required
                  className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                />
              </div>

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

              {/* Số điện thoại */}

              <div>
                <label
                  htmlFor="soDienThoai"
                  className="mb-2 block text-sm font-medium"
                >
                  Số điện thoại
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    (Không bắt buộc)
                  </span>
                </label>

                <input
                  id="soDienThoai"
                  type="tel"
                  value={soDienThoai}
                  onChange={(event) => setSoDienThoai(event.target.value)}
                  maxLength={30}
                  placeholder="0912345678"
                  autoComplete="tel"
                  className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                />
              </div>

              {/* Mật khẩu */}

              <div>
                <label
                  htmlFor="matKhau"
                  className="mb-2 block text-sm font-medium"
                >
                  Mật khẩu
                </label>

                <input
                  id="matKhau"
                  type={hienMatKhau ? "text" : "password"}
                  value={matKhau}
                  onChange={(event) => setMatKhau(event.target.value)}
                  minLength={8}
                  maxLength={128}
                  placeholder="Tối thiểu 8 ký tự"
                  autoComplete="new-password"
                  required
                  className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                />
              </div>

              {/* Xác nhận mật khẩu */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="xacNhanMatKhau"
                    className="text-sm font-medium"
                  >
                    Xác nhận mật khẩu
                  </label>

                  <button
                    type="button"
                    onClick={() => setHienMatKhau(!hienMatKhau)}
                    className="text-xs text-gray-500 hover:text-black"
                  >
                    {hienMatKhau ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  </button>
                </div>

                <input
                  id="xacNhanMatKhau"
                  type={hienMatKhau ? "text" : "password"}
                  value={xacNhanMatKhau}
                  onChange={(event) => setXacNhanMatKhau(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                />
              </div>

              {/* Nút đăng ký */}

              <button
                type="submit"
                disabled={dangGui}
                className="group flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {dangGui ? "Đang tạo tài khoản..." : "Tạo tài khoản"}

                {!dangGui && (
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Đã có tài khoản?{" "}
              <Link
                to="/dang-nhap"
                className="font-semibold text-black underline underline-offset-4"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <p className="text-xs text-gray-400">
            © 2026 FASHIONSTORE. ALL RIGHTS RESERVED.
          </p>
        </section>
      </div>
    </main>
  );
}
