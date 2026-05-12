import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import StatusBadge from '../components/dashboard/StatusBadge.jsx';
import api from '../services/api.js';
import { formatCurrency, formatDate, STATUS_OPTIONS, toInputDate } from '../services/formatters.js';

const emptyRepair = {
  returnOfId: '',
  customerId: '',
  customerName: '',
  phoneNumber: '',
  laptopBrand: '',
  model: '',
  problemDescription: '',
  status: 'Pending',
  technicianId: '',
  intakeDate: toInputDate(new Date()),
  diagnosisDate: '',
  completionDate: '',
  deliveryDate: '',
  estimatedCost: '',
  finalCost: '',
  notes: ''
};

function RepairsPage() {
  const [repairs, setRepairs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [form, setForm] = useState(emptyRepair);
  const [editingId, setEditingId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [repairsResponse, customersResponse, techniciansResponse] = await Promise.all([
          api.get('/repairs'),
          api.get('/customers'),
          api.get('/technicians')
        ]);

        startTransition(() => {
          setRepairs(repairsResponse.data);
          setCustomers(customersResponse.data);
          setTechnicians(techniciansResponse.data);
        });
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Unable to load repairs.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('body-scroll-lock', modalOpen);

    if (!modalOpen) {
      return () => {
        document.body.classList.remove('body-scroll-lock');
      };
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        resetForm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('body-scroll-lock');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  const term = deferredSearch.trim().toLowerCase();
  const filteredRepairs = useMemo(() => {
    const base = statusFilter === 'All' ? repairs : repairs.filter((repair) => repair.status === statusFilter);

    if (!term) {
      return base;
    }

    return base.filter((repair) =>
      [
        repair.returnSequence ? `return ${repair.returnSequence}` : '',
        repair.customerName,
        repair.phoneNumber,
        repair.laptopBrand,
        repair.model,
        repair.status,
        repair.technicianName
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [repairs, statusFilter, term]);

  const stats = useMemo(() => {
    const total = repairs.length;
    const pending = repairs.filter((r) => r.status === 'Pending').length;
    const inProgress = repairs.filter((r) => r.status === 'In Progress').length;
    const delivered = repairs.filter((r) => r.status === 'Delivered').length;
    return { total, pending, inProgress, delivered };
  }, [repairs]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find((entry) => entry._id === customerId);

    setForm((current) => ({
      ...current,
      customerId,
      customerName: customer?.name || current.customerName,
      phoneNumber: customer?.phoneNumber || current.phoneNumber
    }));
  };

  const openNewRepair = () => {
    setEditingId('');
    setForm({ ...emptyRepair, intakeDate: toInputDate(new Date()) });
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({ ...emptyRepair, intakeDate: toInputDate(new Date()) });
    setEditingId('');
    setModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = { ...form };
      const response = editingId
        ? await api.put(`/repairs/${editingId}`, payload)
        : await api.post('/repairs', payload);

      if (editingId) {
        setRepairs((current) => current.map((item) => (item._id === editingId ? response.data : item)));
      } else {
        setRepairs((current) => [response.data, ...current]);
      }

      resetForm();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Unable to save repair.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (repair) => {
    setEditingId(repair._id);
    setForm({
      returnOfId: repair.returnOf?._id || '',
      customerId: repair.customer?._id || '',
      customerName: repair.customerName,
      phoneNumber: repair.phoneNumber,
      laptopBrand: repair.laptopBrand,
      model: repair.model,
      problemDescription: repair.problemDescription,
      status: repair.status,
      technicianId: repair.technician?._id || '',
      intakeDate: toInputDate(repair.intakeDate),
      diagnosisDate: toInputDate(repair.diagnosisDate),
      completionDate: toInputDate(repair.completionDate),
      deliveryDate: toInputDate(repair.deliveryDate),
      estimatedCost: repair.estimatedCost || '',
      finalCost: repair.finalCost || '',
      notes: repair.notes || ''
    });
    setModalOpen(true);
  };

  const handleReturnForRepair = (repair) => {
    setEditingId('');
    setForm({
      ...emptyRepair,
      returnOfId: repair._id,
      customerId: repair.customer?._id || '',
      customerName: repair.customerName,
      phoneNumber: repair.phoneNumber,
      laptopBrand: repair.laptopBrand,
      model: repair.model,
      status: 'Pending',
      technicianId: '',
      intakeDate: toInputDate(new Date()),
      estimatedCost: '',
      finalCost: '',
      problemDescription: ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (repairId) => {
    if (!window.confirm('Delete this repair record?')) {
      return;
    }

    try {
      await api.delete(`/repairs/${repairId}`);
      setRepairs((current) => current.filter((repair) => repair._id !== repairId));
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete repair.');
    }
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Repair Management</p>
          <h2>Add, update, assign, and track every laptop repair</h2>
        </div>
      </div>

      <section className="glass-card page-panel">
        <div className="repairs-toolbar">
          <div>
            <h3>Repair Records</h3>
            <p className="repairs-subtitle">Search, filter, and keep every repair organized.</p>
          </div>

          <div className="repairs-toolbar-actions">
            <input
              className="search-input"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, device, phone, status..."
              value={search}
            />

            <button className="button button-small" onClick={openNewRepair} type="button">
              New repair
            </button>
          </div>
        </div>

        <div className="repairs-meta-row">
          <div className="repairs-stats">
            <div className="metric-pill">
              <strong>{stats.total}</strong>
              <span>Total</span>
            </div>
            <div className="metric-pill">
              <strong>{stats.pending}</strong>
              <span>Pending</span>
            </div>
            <div className="metric-pill">
              <strong>{stats.inProgress}</strong>
              <span>In progress</span>
            </div>
            <div className="metric-pill">
              <strong>{stats.delivered}</strong>
              <span>Delivered</span>
            </div>
          </div>

          <div className="repairs-filters">
            {['All', ...STATUS_OPTIONS].map((status) => (
              <button
                className={`filter-chip ${statusFilter === status ? 'filter-chip--active' : ''}`}
                key={status}
                onClick={() => setStatusFilter(status)}
                type="button"
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="form-note form-note--error">{error}</p> : null}
        {loading ? <p>Loading repairs...</p> : null}

        <div className="table-shell table-shell--stackable">
          <table className="data-table data-table--stackable">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Device</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Intake</th>
                <th>Final Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepairs.length > 0 ? (
                filteredRepairs.map((repair) => (
                  <tr key={repair._id}>
                    <td data-label="Customer">
                      <div className="repairs-customer">
                        <strong>{repair.customerName}</strong>
                        <span>{repair.phoneNumber}</span>
                      </div>
                    </td>
                    <td data-label="Device">
                      <div className="repairs-device">
                        <strong>
                          {repair.laptopBrand} {repair.model}
                        </strong>
                        {repair.returnSequence ? <span className="return-pill">Return #{repair.returnSequence}</span> : null}
                      </div>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={repair.status} />
                    </td>
                    <td data-label="Technician">{repair.technicianName || repair.technician?.name || 'Unassigned'}</td>
                    <td data-label="Intake">{formatDate(repair.intakeDate)}</td>
                    <td data-label="Final Cost">{formatCurrency(repair.finalCost)}</td>
                    <td data-label="Actions">
                      <div className="action-row">
                        <button className="table-action" onClick={() => handleEdit(repair)} type="button">
                          Edit
                        </button>
                        <button className="table-action" onClick={() => handleReturnForRepair(repair)} type="button">
                          Return
                        </button>
                        <button className="table-action table-action--danger" onClick={() => handleDelete(repair._id)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">No repair records match your filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen ? (
        <div className="modal-layer" role="dialog" aria-modal="true">
          <button className="modal-backdrop" aria-label="Close modal" onClick={resetForm} type="button" />
          <div className="modal-card glass-card">
            <div className="panel-heading">
              <div>
                <h3>
                  {editingId ? 'Edit Repair' : form.returnOfId ? 'Return for Repair' : 'New Repair'}
                </h3>
                {form.returnOfId ? <span>Creates a new record linked to the previous repair.</span> : null}
              </div>
              <button className="table-action" onClick={resetForm} type="button">
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="customerId">Customer</label>
                  <select
                    id="customerId"
                    name="customerId"
                    onChange={(event) => handleCustomerSelect(event.target.value)}
                    value={form.customerId}
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="customerName">Customer Name</label>
                  <input id="customerName" name="customerName" onChange={handleChange} required value={form.customerName} />
                </div>

                <div className="input-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input id="phoneNumber" name="phoneNumber" onChange={handleChange} required value={form.phoneNumber} />
                </div>

                <div className="input-group">
                  <label htmlFor="laptopBrand">Laptop Brand</label>
                  <input id="laptopBrand" name="laptopBrand" onChange={handleChange} required value={form.laptopBrand} />
                </div>

                <div className="input-group">
                  <label htmlFor="model">Model</label>
                  <input id="model" name="model" onChange={handleChange} required value={form.model} />
                </div>

                <div className="input-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" onChange={handleChange} value={form.status}>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group input-group--full">
                  <label htmlFor="problemDescription">Problem Description</label>
                  <textarea
                    id="problemDescription"
                    name="problemDescription"
                    onChange={handleChange}
                    required
                    rows="4"
                    value={form.problemDescription}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="technicianId">Technician</label>
                  <select id="technicianId" name="technicianId" onChange={handleChange} value={form.technicianId}>
                    <option value="">Unassigned</option>
                    {technicians.map((technician) => (
                      <option key={technician._id} value={technician._id}>
                        {technician.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="intakeDate">Intake Date</label>
                  <input id="intakeDate" name="intakeDate" onChange={handleChange} type="date" value={form.intakeDate} />
                </div>

                <div className="input-group">
                  <label htmlFor="diagnosisDate">Diagnosis Date</label>
                  <input
                    id="diagnosisDate"
                    name="diagnosisDate"
                    onChange={handleChange}
                    type="date"
                    value={form.diagnosisDate}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="completionDate">Completion Date</label>
                  <input
                    id="completionDate"
                    name="completionDate"
                    onChange={handleChange}
                    type="date"
                    value={form.completionDate}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="deliveryDate">Delivery Date</label>
                  <input
                    id="deliveryDate"
                    name="deliveryDate"
                    onChange={handleChange}
                    type="date"
                    value={form.deliveryDate}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="estimatedCost">Estimated Cost</label>
                  <input
                    id="estimatedCost"
                    min="0"
                    name="estimatedCost"
                    onChange={handleChange}
                    step="1"
                    type="number"
                    value={form.estimatedCost}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="finalCost">Final Cost</label>
                  <input id="finalCost" min="0" name="finalCost" onChange={handleChange} step="1" type="number" value={form.finalCost} />
                </div>

                <div className="input-group input-group--full">
                  <label htmlFor="notes">Notes</label>
                  <textarea id="notes" name="notes" onChange={handleChange} rows="3" value={form.notes} />
                </div>
              </div>

              <div className="repairs-modal-footer">
                <button className="button" disabled={saving} type="submit">
                  {saving ? 'Saving...' : editingId ? 'Update Repair' : 'Save Repair'}
                </button>
                {editingId ? (
                  <button className="button-secondary" onClick={resetForm} type="button">
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RepairsPage;
