import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../services/api.js';

const links = [
  { to: '/app', label: 'Realtime', end: true, icon: DashboardIcon },
  { to: '/app/repairs', label: 'Repairs', icon: RepairsIcon },
  { to: '/app/customers', label: 'Customers', icon: CustomersIcon },
  { to: '/app/messages', label: 'Messages', icon: MessagesIcon },
  { to: '/app/reports', label: 'Reports', icon: ReportsIcon },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon }
];

function DashboardIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="3.5" y="3.5" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="13.5" y="3.5" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="3.5" y="13.5" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="13.5" y="13.5" />
    </svg>
  );
}

function RepairsIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M14.1 6.1a4.25 4.25 0 0 0 4.9 5.4l-7.9 7.9a2.1 2.1 0 0 1-3-3l7.9-7.9a4.25 4.25 0 0 1-5.4-4.9l3 3 2.5-2.5-3-3a4.25 4.25 0 0 1 4.9 5.4l1.3 1.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m15.9 10.7 1.4-1.4a3.2 3.2 0 0 1 4.5 4.5l-1.4 1.4-4.5-4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.8 18.5a5.3 5.3 0 0 1 10.4 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle cx="17.5" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15.2 18.5h5a3.8 3.8 0 0 0-3.7-3.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect height="13.5" rx="2" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="5.2" />
      <path d="m4.5 7 7.5 5.6L19.5 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M4.5 20.5h15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <rect height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.8" width="3.5" x="5.5" y="11" />
      <rect height="11" rx="1.4" stroke="currentColor" strokeWidth="1.8" width="3.5" x="10.25" y="6.5" />
      <rect height="15" rx="1.4" stroke="currentColor" strokeWidth="1.8" width="3.5" x="15" y="2.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m12 3.5 1.3 2.2 2.5.6.4 2.5 2 1.6-.9 2.4.9 2.4-2 1.6-.4 2.5-2.5.6L12 20.5l-1.3-2.2-2.5-.6-.4-2.5-2-1.6.9-2.4-.9-2.4 2-1.6.4-2.5 2.5-.6L12 3.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M10 6.5H7A2.5 2.5 0 0 0 4.5 9v8A2.5 2.5 0 0 0 7 19.5h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M13 8.5 18.5 12 13 15.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M9.5 12h9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path
        d="M10 4.5h4.5A2.5 2.5 0 0 1 17 7v1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function Sidebar({ isOpen, onClose, onLogout, user }) {
  const profileTitle = user?.role || user?.name || 'System Administrator';
  const profileEmail = user?.email || 'admin@newoptiontechnology.com';
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadUnreadMessages = async () => {
      try {
        const { data } = await api.get('/contact-messages/unread-count');

        if (isActive) {
          setUnreadMessages(data.count || 0);
        }
      } catch (error) {
        if (isActive) {
          setUnreadMessages(0);
        }
      }
    };

    const handleMessagesUpdate = () => {
      loadUnreadMessages();
    };

    loadUnreadMessages();
    const pollId = setInterval(loadUnreadMessages, 20000);
    window.addEventListener('contact-messages-updated', handleMessagesUpdate);

    return () => {
      isActive = false;
      clearInterval(pollId);
      window.removeEventListener('contact-messages-updated', handleMessagesUpdate);
    };
  }, [user?.id]);

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand sidebar-brand">
          <span className="brand-mark">
            <img alt="NEW OPTION TECHNOLOGY logo" src="/assets/new-option-logo.png" />
          </span>
          <span className="brand-copy">
            <strong>NEW OPTION TECHNOLOGY</strong>
            <small>Private management system</small>
          </span>
        </div>

        <button aria-label="Close sidebar" className="sidebar-close" onClick={onClose} type="button">
          <CloseIcon />
        </button>
      </div>

      <div className="sidebar-profile">
        <img alt={profileTitle} className="sidebar-avatar" src="/assets/aphrodis-niyonzima.jpeg" />
        <div className="sidebar-profile-copy">
          <strong>{profileTitle}</strong>
          <p>{profileEmail}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ icon: Icon, ...link }) => (
          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
            end={link.end}
            key={link.to}
            to={link.to}
          >
            <span aria-hidden="true" className="sidebar-link-icon">
              <Icon />
            </span>
            <span className="sidebar-link-label">{link.label}</span>
            {link.to === '/app/messages' && unreadMessages > 0 ? (
              <span className="sidebar-link-badge">{unreadMessages > 99 ? '99+' : unreadMessages}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <button className="sidebar-logout" onClick={onLogout} type="button">
        <span aria-hidden="true" className="sidebar-link-icon sidebar-logout-icon">
          <SignOutIcon />
        </span>
        <span>Sign out</span>
      </button>
    </aside>
  );
}

export default Sidebar;
