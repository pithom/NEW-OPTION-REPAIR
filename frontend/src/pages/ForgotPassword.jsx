import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecoveryShell from '../components/auth/RecoveryShell.jsx';
import { ArrowLeftIcon, ArrowRightIcon, MailIcon } from '../components/auth/AuthIcons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { setStoredPasswordResetEmail } from '../services/passwordResetSession.js';

function ForgotPassword() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data } = await api.post(
        '/auth/forgot-password',
        { email: normalizedEmail },
        { skipAuthEvent: true }
      );

      setStoredPasswordResetEmail(normalizedEmail);
      setMessage(data.message);
      window.setTimeout(() => {
        navigate('/verify-otp', { state: { email: normalizedEmail } });
      }, 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to start the password reset process.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecoveryShell
      description="Enter the staff email address linked to the account. If it exists, we will send a 6-digit verification code valid for 5 minutes."
      eyebrow="Forgot password"
      step={1}
      title="Request a reset code"
    >
      <form className="recovery-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Staff email address</label>
          <div className="recovery-input-wrap">
            <span aria-hidden="true" className="recovery-input-icon">
              <MailIcon />
            </span>
            <input
              autoComplete="email"
              className="recovery-input"
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@newoptiontechnology.com"
              required
              type="email"
              value={email}
            />
          </div>
          <p className="recovery-hint">
            We will only continue the recovery flow from a staff address registered on the dashboard.
          </p>
        </div>

        {message ? (
          <div className="recovery-message recovery-message--success">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="recovery-message recovery-message--error">
            {error}
          </div>
        ) : null}

        <div className="recovery-note">
          For account privacy, the response is intentionally generic whether or not the email exists.
        </div>

        <button
          className="recovery-button"
          disabled={isSubmitting}
          type="submit"
        >
          <span>{isSubmitting ? 'Sending code...' : 'Send verification code'}</span>
          <ArrowRightIcon />
        </button>
      </form>

      <div className="recovery-link-row">
        <p>Use the same staff email on the next step so verification can continue without interruption.</p>
        <div className="recovery-link-group">
          <Link className="recovery-link recovery-link--muted" to="/login">
            <ArrowLeftIcon />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </RecoveryShell>
  );
}

export default ForgotPassword;
