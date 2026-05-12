import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RecoveryShell from '../components/auth/RecoveryShell.jsx';
import { ArrowLeftIcon, ArrowRightIcon, LockIcon, MailIcon } from '../components/auth/AuthIcons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import {
  clearStoredPasswordResetEmail,
  getStoredPasswordResetEmail
} from '../services/passwordResetSession.js';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [email] = useState(location.state?.email || getStoredPasswordResetEmail());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
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
      const { data } = await api.post(
        '/auth/reset-password',
        {
          email,
          newPassword,
          confirmPassword
        },
        { skipAuthEvent: true }
      );

      clearStoredPasswordResetEmail();
      setMessage(data.message);
      window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1300);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to reset password right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecoveryShell
      description="Create a strong replacement password. Your reset session is short-lived and only works once after OTP verification."
      eyebrow="Reset password"
      step={3}
      title="Choose a new password"
    >
      {!email ? (
        <div className="recovery-message recovery-message--warning">
          <p>Your reset session is missing. Start the recovery flow again to request a new OTP.</p>
          <Link className="recovery-link" to="/forgot-password">
            <ArrowLeftIcon />
            <span>Restart password recovery</span>
          </Link>
        </div>
      ) : (
        <form className="recovery-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Staff email address</label>
            <div className="recovery-input-wrap recovery-input-wrap--static">
              <span aria-hidden="true" className="recovery-input-icon">
                <MailIcon />
              </span>
              <input
                className="recovery-input"
                id="email"
                readOnly
                type="email"
                value={email}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="newPassword">New password</label>
            <div className="recovery-input-wrap">
              <span aria-hidden="true" className="recovery-input-icon">
                <LockIcon />
              </span>
              <input
                autoComplete="new-password"
                className="recovery-input"
                id="newPassword"
                minLength={4}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Create a strong password"
                required
                type="password"
                value={newPassword}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="recovery-input-wrap">
              <span aria-hidden="true" className="recovery-input-icon">
                <LockIcon />
              </span>
              <input
                autoComplete="new-password"
                className="recovery-input"
                id="confirmPassword"
                minLength={4}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat the new password"
                required
                type="password"
                value={confirmPassword}
              />
            </div>
          </div>

          <div className="recovery-note recovery-password-rules">
            <strong>Password requirements</strong>
            <p>Use at least 4 characters.</p>
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

          <button
            className="recovery-button"
            disabled={isSubmitting}
            type="submit"
          >
            <span>{isSubmitting ? 'Resetting password...' : 'Reset password'}</span>
            <ArrowRightIcon />
          </button>
        </form>
      )}

      <div className="recovery-link-row">
        <p>After the password is updated, the current reset session is closed and you can sign in normally.</p>
        <div className="recovery-link-group">
          <Link className="recovery-link" to="/verify-otp">
            <ArrowLeftIcon />
            <span>Back to OTP verification</span>
          </Link>
          <Link className="recovery-link recovery-link--muted" to="/login">
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </RecoveryShell>
  );
}

export default ResetPassword;
