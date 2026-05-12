import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import api from '../services/api.js';

const emptyTechnician = {
  name: '',
  phoneNumber: '',
  email: '',
  specialty: '',
  active: true
};

function TechniciansPage() {
  const [technicians, setTechnicians] = useState([]);
  const [form, setForm] = useState(emptyTechnician);
  const [editingId, setEditingId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const loadTechnicians = async () => {
      setLoading(true);

      try {
        const { data } = await api.get('/technicians');
        startTransition(() => setTechnicians(data));
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Unable to load technicians.');
      } finally {
        setLoading(false);
      }
    };

    loadTechnicians();
  }, []);

  const term = deferredSearch.trim().toLowerCase();
  const filteredTechnicians = !term
    ? technicians
    : technicians.filter((technician) =>
        [technician.name, technician.phoneNumber, technician.email, technician.specialty]
          .join(' ')
          .toLowerCase()
          .includes(term)
      );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setForm(emptyTechnician);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = { ...form };
      const response = editingId
        ? await api.put(`/technicians/${editingId}`, payload)
        : await api.post('/technicians', payload);

      if (editingId) {
        setTechnicians((current) => current.map((item) => (item._id === editingId ? response.data : item)));
      } else {
        setTechnicians((current) => [response.data, ...current]);
      }

      resetForm();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Unable to save technician.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (technician) => {
    setEditingId(technician._id);
    setForm({
      name: technician.name,
      phoneNumber: technician.phoneNumber || '',
      email: technician.email || '',
      specialty: technician.specialty || '',
      active: technician.active
    });
  };

  const handleDelete = async (technicianId) => {
    if (!window.confirm('Delete this technician?')) {
      return;
    }

    try {
      await api.delete(`/technicians/${technicianId}`);
      setTechnicians((current) => current.filter((technician) => technician._id !== technicianId));
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete technician.');
    }
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Technicians</p>
          <h2>Assign skilled staff to repairs and keep team records organized</h2>
        </div>
      </div>

      <div className="page-grid">
        <form className="glass-card form-card" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <h3>{editingId ? 'Edit Technician' : 'Add Technician'}</h3>
            {editingId ? (
              <button className="text-link" onClick={resetForm} type="button">
                Cancel editing
              </button>
            ) : null}
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="name">Technician Name</label>
              <input id="name" name="name" onChange={handleChange} required value={form.name} />
            </div>

            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input id="phoneNumber" name="phoneNumber" onChange={handleChange} value={form.phoneNumber} />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" onChange={handleChange} type="email" value={form.email} />
            </div>

            <div className="input-group">
              <label htmlFor="specialty">Specialty</label>
              <input id="specialty" name="specialty" onChange={handleChange} value={form.specialty} />
            </div>

            <label className="checkbox-row">
              <input checked={form.active} name="active" onChange={handleChange} type="checkbox" />
              <span>Active technician</span>
            </label>
          </div>

          <button className="button" disabled={saving} type="submit">
            {saving ? 'Saving...' : editingId ? 'Update Technician' : 'Add Technician'}
          </button>

          {error ? <p className="form-note form-note--error">{error}</p> : null}
        </form>

        <section className="glass-card chart-card">
          <div className="panel-heading">
            <h3>Technician List</h3>
            <input
              className="search-input"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search technicians..."
              value={search}
            />
          </div>

          {loading ? <p>Loading technicians...</p> : null}

          <div className="table-shell table-shell--stackable">
            <table className="data-table data-table--stackable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Specialty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTechnicians.length > 0 ? (
                  filteredTechnicians.map((technician) => (
                    <tr key={technician._id}>
                      <td data-label="Name">{technician.name}</td>
                      <td data-label="Phone">{technician.phoneNumber || 'N/A'}</td>
                      <td data-label="Email">{technician.email || 'N/A'}</td>
                      <td data-label="Specialty">{technician.specialty || 'N/A'}</td>
                      <td data-label="Status">{technician.active ? 'Active' : 'Inactive'}</td>
                      <td data-label="Actions">
                        <div className="action-row">
                          <button className="table-action" onClick={() => handleEdit(technician)} type="button">
                            Edit
                          </button>
                          <button className="table-action table-action--danger" onClick={() => handleDelete(technician._id)} type="button">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">No technician records found.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TechniciansPage;
