import { Link } from 'react-router-dom';

function SunIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.5v2.1M12 18.4v2.1M5.9 5.9l1.5 1.5M16.6 16.6l1.5 1.5M3.5 12h2.1M18.4 12h2.1M5.9 18.1l1.5-1.5M16.6 7.4l1.5-1.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function Topbar({ onMenuClick, user }) {
  const today = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full'
  }).format(new Date());

  return (
    <header className="topbar glass-card">
      <div className="topbar-mobile-layout">
        <button aria-label="Open sidebar menu" className="menu-button topbar-control" onClick={onMenuClick} type="button">
          <span />
          <span />
          <span />
        </button>

        <Link aria-label="Open dashboard" className="topbar-mobile-brand" to="/app">
          <span className="topbar-mobile-brand-mark">
            <img alt="NEW OPTION TECHNOLOGY logo" src="/assets/new-option-logo.png" />
          </span>
          <span className="topbar-mobile-brand-copy">
            <strong>NEW OPTION</strong>
            <small>TECHNOLOGY</small>
          </span>
        </Link>

        <Link aria-label="Open settings" className="topbar-control topbar-control--settings" to="/app/settings">
          <SunIcon />
        </Link>
      </div>

      <div className="topbar-desktop-layout">
        <div className="topbar-copy">
          <div>
            <p className="eyebrow">Staff Workspace</p>
            <h1>{user?.name ? `Welcome back, ${user.name}` : 'Management dashboard'}</h1>
          </div>
        </div>

        <div className="topbar-meta">
          <span>{today}</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
