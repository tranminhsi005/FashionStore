import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";

/** Subtle route transition based on Animate UI's short fade/slide motion. */
export default function PageMotion({ children }) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(7px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -7, filter: "blur(4px)" }}
        transition={{ type: "spring", stiffness: 190, damping: 25, mass: 0.8 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
