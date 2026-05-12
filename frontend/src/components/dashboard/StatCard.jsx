import { formatCurrency } from '../../services/formatters.js';

function StatCard({ label, value, money = false, accent = 'teal' }) {
  return (
    <article className={`stat-card stat-card--${accent}`}>
      <p>{label}</p>
      <strong>{money ? formatCurrency(value) : value}</strong>
    </article>
  );
}

export default StatCard;
