import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

function SettingsPage() {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [profileMessage, setProfileMessage] = useState({ text: '', type: 'success' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: 'success' });
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    setProfileMessage({ text: '', type: 'success' });
    setIsProfileSubmitting(true);

    try {
      const { data } = await api.put('/auth/profile', profileForm);
      setUser(data.user);
      setProfileMessage({ text: data.message, type: 'success' });
    } catch (error) {
      setProfileMessage({
        text: error.response?.data?.message || 'Unable to update profile.',
        type: 'error'
      });
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setPasswordMessage({ text: '', type: 'success' });
    setIsPasswordSubmitting(true);

    try {
      const { data } = await api.put('/auth/change-password', passwordForm);
      setPasswordMessage({ text: data.message, type: 'success' });
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (error) {
      setPasswordMessage({
        text: error.response?.data?.message || 'Unable to change password.',
        type: 'error'
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Update your profile and secure your account</h2>
        </div>
      </div>

      <div className="page-grid">
        <form className="glass-card form-card" onSubmit={submitProfile}>
          <div className="panel-heading">
            <h3>Profile Update</h3>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" onChange={handleProfileChange} required value={profileForm.name} />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                onChange={handleProfileChange}
                required
                type="email"
                value={profileForm.email}
              />
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" onChange={handleProfileChange} value={profileForm.phone} />
            </div>
          </div>

          <button className="button" disabled={isProfileSubmitting} type="submit">
            {isProfileSubmitting ? 'Saving...' : 'Save Profile'}
          </button>

          {profileMessage.text ? (
            <p className={`form-note ${profileMessage.type === 'error' ? 'form-note--error' : ''}`}>
              {profileMessage.text}
            </p>
          ) : null}
        </form>

        <form className="glass-card form-card" onSubmit={submitPassword}>
          <div className="panel-heading">
            <h3>Change Password</h3>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                autoComplete="current-password"
                id="currentPassword"
                name="currentPassword"
                onChange={handlePasswordChange}
                required
                type="password"
                value={passwordForm.currentPassword}
              />
            </div>

            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                autoComplete="new-password"
                id="newPassword"
                minLength="4"
                name="newPassword"
                onChange={handlePasswordChange}
                required
                type="password"
                value={passwordForm.newPassword}
              />
            </div>
          </div>

          <button className="button" disabled={isPasswordSubmitting} type="submit">
            {isPasswordSubmitting ? 'Updating...' : 'Change Password'}
          </button>

          {passwordMessage.text ? (
            <p className={`form-note ${passwordMessage.type === 'error' ? 'form-note--error' : ''}`}>
              {passwordMessage.text}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;
