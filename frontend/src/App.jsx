import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const ProtectedLayout = lazy(() => import('./layouts/ProtectedLayout.jsx'));
const ContactMessagesPage = lazy(() => import('./pages/ContactMessagesPage.jsx'));
const CustomerDirectoryPage = lazy(() => import('./pages/CustomerDirectoryPage.jsx'));
const CustomersPage = lazy(() => import('./pages/CustomersPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage.jsx'));
const RepairsPage = lazy(() => import('./pages/RepairsPage.jsx'));
const ReportsPage = lazy(() => import('./pages/ReportsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const TechniciansPage = lazy(() => import('./pages/TechniciansPage.jsx'));

const routeFallback = (
  <div className="screen-center">
    <div className="glass-card loader-card">
      <div className="loader-orb" />
      <p>Loading interface...</p>
    </div>
  </div>
);

const renderRoute = (Component) => (
  <Suspense fallback={routeFallback}>
    <Component />
  </Suspense>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={renderRoute(PortfolioPage)} />
      <Route path="/login" element={renderRoute(LoginPage)} />

      <Route path="/app" element={renderRoute(ProtectedLayout)}>
        <Route index element={renderRoute(DashboardPage)} />
        <Route path="repairs" element={renderRoute(RepairsPage)} />
        <Route path="customers" element={renderRoute(CustomersPage)} />
        <Route path="customers/directory" element={renderRoute(CustomerDirectoryPage)} />
        <Route path="messages" element={renderRoute(ContactMessagesPage)} />
        <Route path="technicians" element={renderRoute(TechniciansPage)} />
        <Route path="reports" element={renderRoute(ReportsPage)} />
        <Route path="settings" element={renderRoute(SettingsPage)} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
