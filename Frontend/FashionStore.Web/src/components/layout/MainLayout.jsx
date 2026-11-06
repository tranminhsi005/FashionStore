import { useLocation, Outlet } from "react-router-dom";

import { useEffect } from "react";

import Header from "./Header";
import Footer from "./Footer";

function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);

      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });

        return;
      }
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="min-h-[60vh]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
