import { Link } from 'react-router-dom';
import { KeypadIcon, LockIcon, MailIcon, ShieldIcon } from './AuthIcons.jsx';

const recoverySteps = [
  { label: 'Step 1', value: 'Request code' },
  { label: 'Step 2', value: 'Verify identity' },
  { label: 'Step 3', value: 'Create password' }
];

const recoverySafeguards = [
  {
    title: 'Email confirmation',
    description: 'Recovery starts only from the staff email attached to the account.',
    Icon: MailIcon
  },
  {
    title: 'Short-lived OTP',
    description: 'Each 6-digit code expires quickly and is limited after repeated failures.',
    Icon: KeypadIcon
  },
  {
    title: 'Protected reset flow',
    description: 'Password changes happen after verification without exposing reset tokens.',
    Icon: LockIcon
  }
];

function RecoveryShell({ eyebrow, title, description, step, children }) {
  return (
    <div className="recovery-shell">
      <section className="recovery-visual">
        <div className="recovery-overlay">
          <Link className="brand brand--light recovery-brand" to="/login">
            <span className="brand-mark">
              <img alt="NEW OPTION TECHNOLOGY logo" src="/assets/new-option-logo.png" />
            </span>
            <span className="brand-copy">
              <strong>NEW OPTION TECHNOLOGY</strong>
              <small>Private staff access</small>
            </span>
          </Link>

          <div className="recovery-hero">
            <p className="eyebrow recovery-eyebrow">
              <ShieldIcon />
              <span>Account recovery</span>
            </p>
            <h1>Restore dashboard access with a guided, secure reset flow.</h1>
            <span aria-hidden="true" className="recovery-story-line" />
            <p>
              Request a time-limited verification code, confirm staff identity, and create a
              replacement password in a reset journey designed to keep sensitive tokens off the
              browser.
            </p>
          </div>

          <div className="recovery-step-grid">
            {recoverySteps.map((item, index) => {
              const isActive = step === index + 1;

              return (
                <article
                  aria-current={isActive ? 'step' : undefined}
                  className={`recovery-step-card ${isActive ? 'is-active' : ''}`}
                  key={item.label}
                >
                  <span className="recovery-step-index">{index + 1}</span>
                  <div className="recovery-step-copy">
                    <p>{item.label}</p>
                    <strong>{item.value}</strong>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="recovery-safeguard-grid">
            {recoverySafeguards.map(({ title: safeguardTitle, description: safeguardDescription, Icon }) => (
              <article className="recovery-safeguard" key={safeguardTitle}>
                <span aria-hidden="true" className="recovery-safeguard-icon">
                  <Icon />
                </span>
                <div className="recovery-safeguard-copy">
                  <strong>{safeguardTitle}</strong>
                  <p>{safeguardDescription}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="recovery-panel">
        <div className="glass-card recovery-card">
          <div className="recovery-card-header">
            <div className="recovery-card-copy-block">
              <p className="eyebrow recovery-eyebrow recovery-eyebrow--panel">{eyebrow}</p>
              <h2>{title}</h2>
              <p className="recovery-card-copy">{description}</p>
            </div>

            <div className="recovery-step-badge">
              <strong>Step {step}</strong>
              <span>of 3</span>
            </div>
          </div>

          <div className="recovery-progress" role="presentation">
            {recoverySteps.map((item, index) => (
              <span
                className={`recovery-progress-segment ${step >= index + 1 ? 'is-active' : ''}`}
                key={item.label}
              />
            ))}
          </div>

          <div className="recovery-card-content">{children}</div>
        </div>
      </section>
    </div>
  );
}

export default RecoveryShell;
