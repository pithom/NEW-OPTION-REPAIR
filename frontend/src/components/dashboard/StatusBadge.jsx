import { statusTone } from '../../services/formatters.js';

function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${statusTone(status)}`}>{status}</span>;
}

export default StatusBadge;
