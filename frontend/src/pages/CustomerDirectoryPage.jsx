import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

function CustomerDirectoryPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const deferredSearch = useDeferredValue(search);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/customers');
        startTransition(() => setCustomers(data));
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Unable to load customers.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const term = deferredSearch.trim().toLowerCase();
  const filteredCustomers = !term
    ? customers
    : customers.filter((customer) =>
        [customer.name, customer.phoneNumber, customer.email, customer.address].join(' ').toLowerCase().includes(term)
      );

  const handleDelete = async (customerId) => {
    if (!window.confirm('Delete this customer?')) {
      return;
    }

    try {
      await api.delete(`/customers/${customerId}`);
      setCustomers((current) => current.filter((customer) => customer._id !== customerId));
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete customer.');
    }
  };

  const handleEdit = (customer) => {
    navigate('/app/customers', { state: { customerToEdit: customer } });
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Customers</p>
          <h2>Customer directory and account history overview</h2>
        </div>
        <button className="button-secondary" onClick={() => navigate('/app/customers')} type="button">
          Add Customer
        </button>
      </div>

      <section className="glass-card chart-card">
        <div className="panel-heading">
          <h3>Customer Directory</h3>
          <input
            className="search-input"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers..."
            value={search}
          />
        </div>

        {error ? <p className="form-note form-note--error">{error}</p> : null}
        {loading ? <p>Loading customers...</p> : null}

        <div className="table-shell table-shell--stackable">
          <table className="data-table data-table--stackable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td data-label="Name">{customer.name}</td>
                    <td data-label="Phone">{customer.phoneNumber}</td>
                    <td data-label="Email">{customer.email || 'N/A'}</td>
                    <td data-label="Address">{customer.address || 'N/A'}</td>
                    <td data-label="Actions">
                      <div className="action-row">
                        <button className="table-action" onClick={() => handleEdit(customer)} type="button">
                          Edit
                        </button>
                        <button className="table-action table-action--danger" onClick={() => handleDelete(customer._id)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">No customer records found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CustomerDirectoryPage;
