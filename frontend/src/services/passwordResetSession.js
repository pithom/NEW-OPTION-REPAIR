const PASSWORD_RESET_EMAIL_KEY = 'new_option_password_reset_email';

export const getStoredPasswordResetEmail = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.sessionStorage.getItem(PASSWORD_RESET_EMAIL_KEY) || '';
};

export const setStoredPasswordResetEmail = (email) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(PASSWORD_RESET_EMAIL_KEY, email);
};

export const clearStoredPasswordResetEmail = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(PASSWORD_RESET_EMAIL_KEY);
};
