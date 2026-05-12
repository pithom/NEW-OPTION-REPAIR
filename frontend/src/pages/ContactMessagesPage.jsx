import { useEffect, useState } from 'react';
import api from '../services/api.js';

const formatDateTime = (value) => {
  if (!value) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/contact-messages');
        setMessages(data);
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Unable to load contact messages.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const unreadCount = messages.filter((item) => item.isRead !== true).length;

  const markAllAsRead = async () => {
    if (unreadCount === 0 || markingAllRead) {
      return;
    }

    setMarkingAllRead(true);
    setError('');

    try {
      await api.patch('/contact-messages/mark-all-read');
      setMessages((current) => current.map((item) => ({ ...item, isRead: true, readAt: item.readAt || new Date().toISOString() })));
      window.dispatchEvent(new Event('contact-messages-updated'));
    } catch (markError) {
      setError(markError.response?.data?.message || 'Unable to mark messages as read.');
    } finally {
      setMarkingAllRead(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin Inbox</p>
          <h2>Messages sent from the public profile contact form</h2>
        </div>
      </div>

      <section className="glass-card chart-card">
        <div className="panel-heading">
          <h3>Contact Messages</h3>
          <div className="action-row">
            <span>{messages.length} total</span>
            {unreadCount > 0 ? <span className="new-message-pill">New {unreadCount}</span> : null}
            <button className="table-action" disabled={markingAllRead || unreadCount === 0} onClick={markAllAsRead} type="button">
              {markingAllRead ? 'Marking...' : 'Mark all as read'}
            </button>
          </div>
        </div>

        {loading ? <p>Loading messages...</p> : null}
        {error ? <p className="form-note form-note--error">{error}</p> : null}

        <div className="table-shell table-shell--stackable">
          <table className="data-table data-table--stackable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((item) => (
                  <tr key={item._id}>
                    <td data-label="Name">{item.name}</td>
                    <td data-label="Email">{item.email}</td>
                    <td data-label="Message">
                      <div className="contact-message-cell">
                        <span>{item.message}</span>
                        {item.isRead !== true ? <span className="new-message-pill">New</span> : null}
                      </div>
                    </td>
                    <td data-label="Sent At">{formatDateTime(item.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">No contact messages yet.</div>
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

export default ContactMessagesPage;
