// Confirm dialog — Yes/No prompt built on Modal
import Modal from "./Modal.jsx";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default", // "default" | "danger"
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-charcoal-soft mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="btn-outline">
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
          className={variant === "danger" ? "btn-accent" : "btn-primary"}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
