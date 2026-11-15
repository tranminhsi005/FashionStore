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

  /* ── shared input style ── */
  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#f0f0f5",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    color: "rgba(240,240,245,0.6)",
    textTransform: "uppercase",
  };

  function handleInputFocus(e) {
    e.target.style.borderColor = "#a855f7";
    e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.15)";
  }

  function handleInputBlur(e) {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#030303",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "inherit",
      }}
    >
      {/* Ambient glow orb – purple, top-left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-8%",
          left: "-5%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Ambient glow orb – cyan, bottom-right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-8%",
          right: "-5%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,217,255,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Glass card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "460px",
          margin: "24px",
          background: "rgba(13,13,20,0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "48px",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "0.18em",
              background: "linear-gradient(135deg, #c084fc, #a855f7, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            FASHIONSTORE
          </span>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#a855f7",
              flexShrink: 0,
            }}
          />
        </Link>

        {/* Heading */}
        <p
          style={{
            margin: "0 0 6px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(240,240,245,0.4)",
          }}
        >
          Create your account
        </p>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "30px",
            fontWeight: 700,
            color: "#f0f0f5",
            letterSpacing: "-0.02em",
          }}
        >
          Đăng ký
        </h1>

        <p
          style={{
            margin: "0 0 24px",
            fontSize: "13px",
            lineHeight: "1.7",
            color: "rgba(240,240,245,0.45)",
          }}
        >
          Tạo tài khoản FashionStore để bắt đầu trải nghiệm mua sắm.
        </p>

        {/* Lỗi */}
        {loi && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              fontSize: "13px",
              color: "#f87171",
            }}
          >
            {loi}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={xuLySubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Họ tên */}
          <div>
            <label htmlFor="hoTen" style={labelStyle}>
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
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={labelStyle}>
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
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label htmlFor="soDienThoai" style={labelStyle}>
              Số điện thoại{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  color: "rgba(240,240,245,0.3)",
                  letterSpacing: 0,
                  fontSize: "11px",
                }}
              >
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
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label htmlFor="matKhau" style={labelStyle}>
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
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <label
                htmlFor="xacNhanMatKhau"
                style={{ ...labelStyle, margin: 0 }}
              >
                Xác nhận mật khẩu
              </label>

              <button
                type="button"
                onClick={() => setHienMatKhau(!hienMatKhau)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: "rgba(240,240,245,0.4)",
                  transition: "color 0.2s",
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.target.style.color = "#a855f7")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(240,240,245,0.4)")
                }
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
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={dangGui}
            style={{
              width: "100%",
              padding: "15px 24px",
              marginTop: "8px",
              background: dangGui
                ? "rgba(255,255,255,0.05)"
                : "linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6366f1 100%)",
              border: "none",
              borderRadius: "9999px",
              color: dangGui ? "rgba(240,240,245,0.4)" : "#fff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: dangGui ? "not-allowed" : "pointer",
              opacity: dangGui ? 0.6 : 1,
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: dangGui ? "none" : "0 0 28px rgba(168,85,247,0.4)",
            }}
            onMouseEnter={(e) => {
              if (!dangGui) e.target.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              if (!dangGui) e.target.style.opacity = "1";
            }}
          >
            {dangGui ? "Đang tạo tài khoản..." : "Tạo tài khoản →"}
          </button>
        </form>

        {/* Link đăng nhập */}
        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "13px",
            color: "rgba(240,240,245,0.4)",
          }}
        >
          Đã có tài khoản?{" "}
          <Link
            to="/dang-nhap"
            style={{
              color: "#c084fc",
              textDecoration: "none",
              fontWeight: 600,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.75")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Đăng nhập
          </Link>
        </p>

        {/* Footer copyright */}
        <p
          style={{
            marginTop: "28px",
            textAlign: "center",
            fontSize: "11px",
            color: "rgba(240,240,245,0.2)",
            letterSpacing: "0.08em",
          }}
        >
          © 2026 FASHIONSTORE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </main>
  );
}
