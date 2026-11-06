import { useEffect, useId } from "react";

import { AnimatePresence, motion } from "motion/react";

import { X } from "lucide-react";

import Button from "./Button";

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "medium",
}) {
  const titleId = useId();

  const descriptionId = useId();

  const sizes = {
    small: "max-w-sm",

    medium: "max-w-lg",

    large: "max-w-2xl",
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        p-4
                        backdrop-blur-sm
                    "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.98,
            }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className={`
                            w-full
                            ${sizes[size] || sizes.medium}
                            overflow-hidden
                            rounded-xl
                            bg-white
                            shadow-dialog
                        `}
          >
            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-line px-6 py-5">
              <div>
                <h2
                  id={titleId}
                  className="font-display text-xl font-bold tracking-tight"
                >
                  {title}
                </h2>

                {description && (
                  <p
                    id={descriptionId}
                    className="mt-2 text-sm leading-6 text-muted"
                  >
                    {description}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                aria-label="Đóng hộp thoại"
              >
                <X size={18} />
              </Button>
            </div>

            {/* BODY */}

            <div className="px-6 py-6">{children}</div>

            {/* FOOTER */}

            {footer && (
              <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
