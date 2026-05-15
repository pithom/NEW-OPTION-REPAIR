const TOKEN_KEY = 'new_option_access_token';
const SESSION_TOKEN_KEY = 'new_option_access_token_session';

const canUseStorage = () => typeof window !== 'undefined';

const readFromStorage = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const writeToStorage = (storage, key, value) => {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage write failures (private mode/quota/etc.).
  }
};

const removeFromStorage = (storage, key) => {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage remove failures.
  }
};

export const readAuthToken = () => {
  if (!canUseStorage()) {
    return null;
  }

  return (
    readFromStorage(window.localStorage, TOKEN_KEY) ||
    readFromStorage(window.sessionStorage, SESSION_TOKEN_KEY)
  );
};

export const storeAuthToken = (token, remember = false) => {
  if (!canUseStorage() || !token) {
    return;
  }

  removeFromStorage(window.localStorage, TOKEN_KEY);
  removeFromStorage(window.sessionStorage, SESSION_TOKEN_KEY);

  if (remember) {
    writeToStorage(window.localStorage, TOKEN_KEY, token);
    return;
  }

  writeToStorage(window.sessionStorage, SESSION_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  if (!canUseStorage()) {
    return;
  }

  removeFromStorage(window.localStorage, TOKEN_KEY);
  removeFromStorage(window.sessionStorage, SESSION_TOKEN_KEY);
};
