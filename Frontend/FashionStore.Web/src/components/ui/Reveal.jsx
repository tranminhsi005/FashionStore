import { motion, useReducedMotion } from "motion/react";

/** Scroll reveal using the gentle spring + opacity pattern seen in Animate UI. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 22,
  once = true,
  amount = 0.16,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ type: "spring", stiffness: 170, damping: 24, delay }}
    >
      {children}
    </motion.div>
  );
}
