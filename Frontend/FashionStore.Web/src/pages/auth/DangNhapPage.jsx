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
      {/* Ambient glow orb – cyan, top-right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,217,255,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Ambient glow orb – purple, bottom-left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
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
          maxWidth: "440px",
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
            marginBottom: "36px",
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
          Welcome back
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
          Đăng nhập
        </h1>

        <p
          style={{
            margin: "0 0 24px",
            fontSize: "13px",
            lineHeight: "1.7",
            color: "rgba(240,240,245,0.45)",
          }}
        >
          Đăng nhập để tiếp tục khám phá và mua sắm những sản phẩm thời trang
          yêu thích.
        </p>

        {/* Thông báo đăng ký thành công */}
        {thongBao && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              fontSize: "13px",
              color: "#4ade80",
            }}
          >
            {thongBao}
          </div>
        )}

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
        <form onSubmit={xuLySubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "rgba(240,240,245,0.6)",
                textTransform: "uppercase",
              }}
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
              style={{
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
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#a855f7";
                e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label
              htmlFor="matKhau"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "rgba(240,240,245,0.6)",
                textTransform: "uppercase",
              }}
            >
              Mật khẩu
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#a855f7";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <input
                id="matKhau"
                type={hienMatKhau ? "text" : "password"}
                value={matKhau}
                onChange={(event) => setMatKhau(event.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                required
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "transparent",
                  border: "none",
                  color: "#f0f0f5",
                  fontSize: "14px",
                  outline: "none",
                  minWidth: 0,
                }}
              />
              <button
                type="button"
                onClick={() => setHienMatKhau(!hienMatKhau)}
                style={{
                  padding: "0 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "rgba(240,240,245,0.4)",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#a855f7")}
                onMouseLeave={(e) => (e.target.style.color = "rgba(240,240,245,0.4)")}
              >
                {hienMatKhau ? "Ẩn" : "Hiện"}
              </button>
            </div>
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
              transition: "opacity 0.2s, transform 0.15s",
              opacity: dangGui ? 0.6 : 1,
              boxShadow: dangGui ? "none" : "0 0 28px rgba(168,85,247,0.4)",
            }}
            onMouseEnter={(e) => {
              if (!dangGui) e.target.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              if (!dangGui) e.target.style.opacity = "1";
            }}
          >
            {dangGui ? "Đang đăng nhập..." : "Đăng nhập →"}
          </button>
        </form>

        {/* Link đăng ký */}
        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "13px",
            color: "rgba(240,240,245,0.4)",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to="/dang-ky"
            style={{
              color: "#c084fc",
              textDecoration: "none",
              fontWeight: 600,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.75")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Đăng ký ngay
          </Link>
        </p>

        {/* Footer copyright */}
        <p
          style={{
            marginTop: "32px",
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
