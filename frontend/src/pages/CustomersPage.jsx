import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const emptyCustomer = {
  name: '',
  phoneNumber: '',
  email: '',
  address: '',
  notes: ''
};

function CustomersPage() {
  const [form, setForm] = useState(emptyCustomer);
  const [editingId, setEditingId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const customerToEdit = location.state?.customerToEdit;

    if (!customerToEdit) {
      return;
    }

    setEditingId(customerToEdit._id);
    setForm({
      name: customerToEdit.name,
      phoneNumber: customerToEdit.phoneNumber,
      email: customerToEdit.email || '',
      address: customerToEdit.address || '',
      notes: customerToEdit.notes || ''
    });
    setError('');

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyCustomer);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, form);
      } else {
        await api.post('/customers', form);
      }

      resetForm();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Unable to save customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Customers</p>
          <h2>{editingId ? 'Edit customer details' : 'Add customer details for faster repair intake'}</h2>
        </div>
        <button className="button-secondary" onClick={() => navigate('/app/customers/directory')} type="button">
          Customer Directory
        </button>
      </div>

      <form className="glass-card form-card" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <h3>{editingId ? 'Edit Customer' : 'Add Customer'}</h3>
          {editingId ? (
            <button className="text-link" onClick={resetForm} type="button">
              Cancel editing
            </button>
          ) : null}
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="name">Customer Name</label>
            <input id="name" name="name" onChange={handleChange} required value={form.name} />
          </div>

          <div className="input-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input id="phoneNumber" name="phoneNumber" onChange={handleChange} required value={form.phoneNumber} />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" onChange={handleChange} type="email" value={form.email} />
          </div>

          <div className="input-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" onChange={handleChange} value={form.address} />
          </div>

          <div className="input-group input-group--full">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" onChange={handleChange} rows="4" value={form.notes} />
          </div>
        </div>

        <button className="button" disabled={saving} type="submit">
          {saving ? 'Saving...' : editingId ? 'Update Customer' : 'Add Customer'}
        </button>

        {error ? <p className="form-note form-note--error">{error}</p> : null}
      </form>
    </div>
  );
}

export default CustomersPage;
