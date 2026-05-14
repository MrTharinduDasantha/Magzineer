// Reusable animated modal — backdrop click + ESC to close
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  // Close on ESC + lock body scroll while open
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const sizeMap = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-charcoal/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal card */}
          <motion.div
            className={`relative w-full ${sizeMap[size]} bg-paper rounded-lg shadow-2xl max-h-[90vh] flex flex-col`}
            initial={{ y: 30, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                <h3 className="text-xl font-display text-charcoal">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-muted hover:text-crimson transition-colors p-1"
                  aria-label="Close"
                >
                  <IoCloseOutline size={26} />
                </button>
              </div>
            )}

            {/* Scrollable body */}
            <div className="p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
