import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ShieldIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3 5.5 5.6v5.9c0 4.2 2.7 8 6.5 9.5 3.8-1.5 6.5-5.3 6.5-9.5V5.6L12 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m9.5 11.9 1.6 1.7 3.4-3.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m5.5 8 6.5 5 6.5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 10.5h10a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18v-6A1.5 1.5 0 0 1 7 10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 10.5V8.7a3.5 3.5 0 1 1 7 0v1.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 14.3v1.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 19.5h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M7.5 16v-4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 16v-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M16.5 16v-11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="M2.6 12s3.3-5.7 9.4-5.7 9.4 5.7 9.4 5.7-3.3 5.7-9.4 5.7S2.6 12 2.6 12Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 4.5 21 19.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M10 6.6A10.2 10.2 0 0 1 12 6.3c6.1 0 9.4 5.7 9.4 5.7a16 16 0 0 1-3 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M7.2 8.4A16.5 16.5 0 0 0 2.6 12s3.3 5.7 9.4 5.7c1.5 0 2.9-.3 4.1-.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M19 12H5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="m11 6-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const loginHighlights = [
  {
    title: 'Secure',
    description: 'Encrypted access',
    Icon: LockIcon
  },
  {
    title: 'Trusted',
    description: 'Authorized staff only',
    Icon: ShieldIcon
  },
  {
    title: 'Efficient',
    description: 'All-in-one management',
    Icon: ChartIcon
  }
];

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(credentials, { remember: rememberMe });
      navigate('/app', { replace: true });
    } catch (loginError) {
      setError(loginError.response?.data?.message || 'Unable to reach the login service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-visual">
        <div className="login-overlay">
          <Link className="brand brand--light login-brand" to="/">
            <span className="brand-mark">
              <img alt="NEW OPTION TECHNOLOGY logo" src="/assets/new-option-logo.png" />
            </span>
            <span className="brand-copy">
              <strong>NEW OPTION TECHNOLOGY</strong>
              <small>Private staff login</small>
            </span>
          </Link>

          <div className="login-visual-copy">
            <p className="eyebrow login-eyebrow">
              <ShieldIcon />
              <span>Secure access</span>
            </p>
            <h1>
              Manage repairs, technicians, customers, and reports in <span>one place.</span>
            </h1>
            <span aria-hidden="true" className="login-story-line" />
            <p>
              This portal is reserved for authorized staff only. After login, you will be redirected
              to the private repair management dashboard.
            </p>
          </div>

          <div className="login-feature-row">
            {loginHighlights.map(({ title, description, Icon }) => (
              <article className="login-feature" key={title}>
                <span aria-hidden="true" className="login-feature-icon">
                  <Icon />
                </span>
                <div className="login-feature-copy">
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="login-panel">
        <form className="glass-card login-card" onSubmit={handleSubmit}>
          <p className="eyebrow login-eyebrow">
            <ShieldIcon />
            <span>Staff authentication</span>
          </p>
          <h2>Sign in</h2>
          <p className="login-card-copy">
            Public visitors can return to the portfolio homepage at any time.
          </p>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="login-input-wrap">
              <span aria-hidden="true" className="login-input-icon">
                <MailIcon />
              </span>
              <input
                autoComplete="username"
                className="login-input"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="Enter your email"
                required
                type="email"
                value={credentials.email}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrap">
              <span aria-hidden="true" className="login-input-icon">
                <LockIcon />
              </span>
              <input
                autoComplete="current-password"
                className="login-input"
                id="password"
                minLength="4"
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                required
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="login-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div className="login-meta-row">
            <label className="login-check">
              <input
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                type="checkbox"
              />
              <span aria-hidden="true" className="login-check-box" />
              <span>Remember me</span>
            </label>
          </div>

          <button className="button login-submit" disabled={isSubmitting} type="submit">
            <span>{isSubmitting ? 'Signing in...' : 'Login'}</span>
            <ArrowRightIcon />
          </button>

          {error ? <p className="form-note form-note--error">{error}</p> : null}

          <div className="login-separator">
            <span>OR</span>
          </div>

          <Link className="text-link login-back-link" to="/">
            <ArrowLeftIcon />
            <span>Back to portfolio</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
