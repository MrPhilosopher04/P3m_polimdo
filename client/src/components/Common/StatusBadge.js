// client/src/components/Common/StatusBadge.js
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    SUBMITTED: { label: 'Diajukan', color: 'bg-blue-100 text-blue-800' },
    APPROVED: { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-800' }
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;