import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-slate-400 text-sm mb-5">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 rounded-lg py-2.5 text-sm">Cancel</button>
        <button onClick={onConfirm}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${danger ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}