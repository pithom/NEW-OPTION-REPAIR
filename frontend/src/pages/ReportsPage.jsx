import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import StatusBadge from '../components/dashboard/StatusBadge.jsx';
import api from '../services/api.js';
import { formatCurrency, formatDate } from '../services/formatters.js';

function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/reports');
        setReports(data);
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Unable to load reports.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return <div className="glass-card page-panel">Loading reports...</div>;
  }

  if (error) {
    return <div className="glass-card page-panel form-note form-note--error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Reports</p>
          <h2>Daily repairs, revenue visibility, and status analytics</h2>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card stat-card--teal">
          <p>Total Revenue</p>
          <strong>{formatCurrency(reports.revenueSummary.totalRevenue)}</strong>
        </article>
        <article className="stat-card stat-card--gold">
          <p>Average Ticket</p>
          <strong>{formatCurrency(reports.revenueSummary.averageTicket)}</strong>
        </article>
        <article className="stat-card stat-card--blue">
          <p>Today&apos;s Repairs</p>
          <strong>{reports.todayRepairs.length}</strong>
        </article>
      </div>

      <div className="charts-grid">
        <article className="glass-card chart-card">
          <div className="panel-heading">
            <h3>Daily Repairs</h3>
            <span>Last 7 intake days</span>
          </div>

          <ResponsiveContainer height={280} width="100%">
            <BarChart data={reports.dailyRepairs}>
              <CartesianGrid opacity={0.18} stroke="#3c4b66" strokeDasharray="4 4" />
              <XAxis dataKey="date" stroke="#9fb0d0" />
              <YAxis stroke="#9fb0d0" />
              <Tooltip />
              <Legend />
              <Bar dataKey="repairs" fill="#24c8b3" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="glass-card chart-card">
          <div className="panel-heading">
            <h3>Technician Performance</h3>
            <span>Repairs handled per technician</span>
          </div>

          <ResponsiveContainer height={280} width="100%">
            <BarChart data={reports.technicianPerformance}>
              <CartesianGrid opacity={0.18} stroke="#3c4b66" strokeDasharray="4 4" />
              <XAxis dataKey="name" stroke="#9fb0d0" />
              <YAxis stroke="#9fb0d0" />
              <Tooltip />
              <Legend />
              <Bar dataKey="repairs" fill="#7dd3fc" radius={[10, 10, 0, 0]} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>

      <article className="glass-card chart-card">
        <div className="panel-heading">
          <h3>Status Analytics</h3>
          <span>Current repair flow distribution</span>
        </div>

        <div className="analytics-strip">
          {reports.statusAnalytics.map((status) => (
            <div className="metric-pill" key={status.name}>
              <strong>{status.count}</strong>
              <span>{status.name}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="glass-card chart-card">
        <div className="panel-heading">
          <h3>Today&apos;s Repairs</h3>
          <span>Most recent service intake activity</span>
        </div>

        <div className="table-shell table-shell--stackable">
          <table className="data-table data-table--stackable">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Device</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Intake</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reports.todayRepairs.length > 0 ? (
                reports.todayRepairs.map((repair) => (
                  <tr key={repair._id}>
                    <td data-label="Customer">{repair.customerName}</td>
                    <td data-label="Device">
                      {repair.laptopBrand} {repair.model}
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={repair.status} />
                    </td>
                    <td data-label="Technician">{repair.technicianName || 'Unassigned'}</td>
                    <td data-label="Intake">{formatDate(repair.intakeDate)}</td>
                    <td data-label="Revenue">{formatCurrency(repair.finalCost)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">No repair activity recorded for today.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

export default ReportsPage;
