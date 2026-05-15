import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../services/api.js';
import { clearAuthToken, storeAuthToken } from '../services/authToken.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const hasActiveSessionRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      try {
        const { data } = await api.get('/auth/me', { skipAuthEvent: true });
        if (isActive) {
          setUser(data.user);
          hasActiveSessionRef.current = Boolean(data.user);
        }
      } catch (error) {
        if (isActive && !hasActiveSessionRef.current) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsBootstrapping(false);
        }
      }
    };

    const handleUnauthorized = () => {
      if (!isActive) {
        return;
      }

      hasActiveSessionRef.current = false;
      setUser(null);
      setIsBootstrapping(false);
    };

    bootstrap();
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isActive = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials, options = {}) => {
    const { data } = await api.post('/auth/login', {
      ...credentials,
      remember: Boolean(options.remember)
    }, {
      skipAuthEvent: true
    });

    if (data.token) {
      storeAuthToken(data.token, Boolean(options.remember));
    } else {
      clearAuthToken();
    }

    hasActiveSessionRef.current = true;
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Clear local auth state even if the server session is already gone.
    } finally {
      hasActiveSessionRef.current = false;
      clearAuthToken();
      setUser(null);
      setIsBootstrapping(false);
    }
  };

  const refreshProfile = async () => {
    const { data } = await api.get('/auth/me');
    hasActiveSessionRef.current = Boolean(data.user);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isBootstrapping,
        login,
        logout,
        refreshProfile,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
