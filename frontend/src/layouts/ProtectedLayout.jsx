import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import Topbar from '../components/dashboard/Topbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedLayout() {
  const { isAuthenticated, isBootstrapping, logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('body-scroll-lock', sidebarOpen);

    return () => {
      document.body.classList.remove('body-scroll-lock');
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen]);

  if (isBootstrapping) {
    return (
      <div className="screen-center">
        <div className="glass-card loader-card">
          <div className="loader-orb" />
          <p>Loading secure workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
        user={user}
      />

      {sidebarOpen ? (
        <button
          aria-label="Close sidebar"
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <div className="app-main">
        <Topbar onMenuClick={() => setSidebarOpen((current) => !current)} user={user} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ProtectedLayout;
