import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { AnimatedGrid, GlowOrb, PageMotion } from "../ui";

function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        requestAnimationFrame(() => element.scrollIntoView({ behavior: "smooth", block: "start" }));
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="app-shell noise-overlay relative min-h-screen overflow-clip bg-void text-white">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <AnimatedGrid cellSize={58} color="rgba(215, 196, 255, 0.055)" />
        <GlowOrb color="purple" size={620} opacity={0.11} top="-330px" left="-240px" />
        <GlowOrb color="cyan" size={520} opacity={0.075} top="18%" right="-320px" />
        <GlowOrb color="purple" size={560} opacity={0.07} bottom="-360px" left="30%" />
      </div>

      <div className="relative z-10">
        <Header />
        <main className="min-h-[60vh]">
          <PageMotion><Outlet /></PageMotion>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
