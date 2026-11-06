import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="text-center">
        <p className="eyebrow text-muted">PAGE NOT FOUND</p>

        <h1 className="mt-5 font-display text-8xl font-extrabold tracking-[-0.1em]">
          404
        </h1>

        <p className="mt-5 text-sm text-muted">
          Đường dẫn bạn đang truy cập không tồn tại.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block bg-ink px-7 py-4 text-sm font-semibold text-white transition hover:bg-accent hover:text-ink"
        >
          Trở về trang chủ
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
