// components/patients/DischargeModal.jsx
import ConfirmDialog from '../common/ConfirmDialog';

export default function DischargeModal({ open, onClose, onConfirm, patient }) {
  return (
    <ConfirmDialog open={open} onClose={onClose} onConfirm={onConfirm}
      title={`Discharge ${patient?.name || 'patient'}?`}
      message="The bed will be freed. Vitals history and alerts are retained."
      confirmLabel="Confirm Discharge" />
  );
}