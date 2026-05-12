import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import StatCard from '../components/dashboard/StatCard.jsx';
import StatusBadge from '../components/dashboard/StatusBadge.jsx';
import api from '../services/api.js';
import { formatCurrency, formatDate, STATUS_OPTIONS } from '../services/formatters.js';

const pieColors = ['#24c8b3', '#f59e0b', '#7dd3fc', '#4ade80', '#fb7185'];

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/dashboard');
        setSummary(data);
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statusData =
    summary?.statusBreakdown?.length > 0
      ? summary.statusBreakdown
      : STATUS_OPTIONS.map((status) => ({ name: status, value: 0 }));

  const monthlyRevenue =
    summary?.monthlyRevenue?.length > 0 ? summary.monthlyRevenue : [{ name: 'No data', revenue: 0 }];

  if (loading) {
    return <div className="glass-card page-panel">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="glass-card page-panel form-note form-note--error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Repair activity and business performance</h2>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard accent="teal" label="Total Repairs" value={summary.totalRepairs} />
        <StatCard accent="gold" label="Pending Repairs" value={summary.pendingRepairs} />
        <StatCard accent="green" label="Completed Repairs" value={summary.completedRepairs} />
        <StatCard accent="blue" label="Revenue Summary" money value={summary.revenue} />
      </div>

      <div className="charts-grid">
        <article className="glass-card chart-card">
          <div className="panel-heading">
            <h3>Revenue Trend</h3>
            <span>{formatCurrency(summary.revenue)}</span>
          </div>

          <ResponsiveContainer height={280} width="100%">
            <LineChart data={monthlyRevenue}>
              <CartesianGrid opacity={0.18} stroke="#3c4b66" strokeDasharray="4 4" />
              <XAxis dataKey="name" stroke="#9fb0d0" />
              <YAxis stroke="#9fb0d0" />
              <Tooltip />
              <Line dataKey="revenue" dot={{ r: 4 }} stroke="#24c8b3" strokeWidth={3} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <article className="glass-card chart-card">
          <div className="panel-heading">
            <h3>Status Breakdown</h3>
            <span>{summary.totalRepairs} repairs tracked</span>
          </div>

          <ResponsiveContainer height={280} width="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={4}>
                {statusData.map((entry, index) => (
                  <Cell fill={pieColors[index % pieColors.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </div>

      <article className="glass-card chart-card">
        <div className="panel-heading">
          <h3>Recent Repairs</h3>
          <span>{summary.recentRepairs.length} latest updates</span>
        </div>

        <div className="table-shell table-shell--stackable">
          <table className="data-table data-table--stackable">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Device</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Intake Date</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentRepairs.length > 0 ? (
                summary.recentRepairs.map((repair) => (
                  <tr key={repair._id}>
                    <td data-label="Customer">{repair.customerName}</td>
                    <td data-label="Device">
                      {repair.laptopBrand} {repair.model}
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={repair.status} />
                    </td>
                    <td data-label="Technician">{repair.technicianName || repair.technician?.name || 'Unassigned'}</td>
                    <td data-label="Intake Date">{formatDate(repair.intakeDate)}</td>
                    <td data-label="Revenue">{formatCurrency(repair.finalCost)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">No repairs have been recorded yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="glass-card chart-card">
        <div className="panel-heading">
          <h3>Repair Volume Snapshot</h3>
          <span>Current workflow distribution</span>
        </div>

        <ResponsiveContainer height={260} width="100%">
          <BarChart data={statusData}>
            <CartesianGrid opacity={0.18} stroke="#3c4b66" strokeDasharray="4 4" />
            <XAxis dataKey="name" stroke="#9fb0d0" />
            <YAxis stroke="#9fb0d0" />
            <Tooltip />
            <Bar dataKey="value" fill="#7dd3fc" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </article>
    </div>
  );
}

export default DashboardPage;
