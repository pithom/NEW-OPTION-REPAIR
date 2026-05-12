import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RecoveryShell from '../components/auth/RecoveryShell.jsx';
import { ArrowLeftIcon, ArrowRightIcon, KeypadIcon, MailIcon } from '../components/auth/AuthIcons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { getStoredPasswordResetEmail, setStoredPasswordResetEmail } from '../services/passwordResetSession.js';

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState(location.state?.email || getStoredPasswordResetEmail());
  const [otp, setOtp] = useState('');
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
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedOtp = otp.replace(/\D/g, '').slice(0, 6);
      const { data } = await api.post(
        '/auth/verify-otp',
        { email: normalizedEmail, otp: normalizedOtp },
        { skipAuthEvent: true }
      );

      setStoredPasswordResetEmail(normalizedEmail);
      setMessage(data.message);
      navigate('/reset-password', { state: { email: normalizedEmail, message: data.message } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to verify the OTP right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecoveryShell
      description="Enter the same email address and the 6-digit code from your inbox. The code expires in 5 minutes and is locked after too many failed attempts."
      eyebrow="Verify OTP"
      step={2}
      title="Confirm your one-time code"
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
        </div>

        <div className="input-group">
          <label htmlFor="otp">6-digit verification code</label>
          <div className="recovery-input-wrap">
            <span aria-hidden="true" className="recovery-input-icon">
              <KeypadIcon />
            </span>
            <input
              autoComplete="one-time-code"
              className="recovery-input recovery-input--otp"
              id="otp"
              inputMode="numeric"
              maxLength={6}
              name="otp"
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
              pattern="[0-9]{6}"
              placeholder="000000"
              required
              value={otp}
            />
          </div>
          <p className="recovery-hint">Use the most recent code from your inbox. Each code is valid for 5 minutes.</p>
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
          <span>{isSubmitting ? 'Verifying code...' : 'Verify code'}</span>
          <ArrowRightIcon />
        </button>
      </form>

      <div className="recovery-link-row">
        <p>If the code expired, request a fresh one and retry with the same staff email address.</p>
        <div className="recovery-link-group">
          <Link className="recovery-link" to="/forgot-password">
            <ArrowLeftIcon />
            <span>Request a new code</span>
          </Link>
          <Link className="recovery-link recovery-link--muted" to="/login">
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </RecoveryShell>
  );
}

export default VerifyOtp;
