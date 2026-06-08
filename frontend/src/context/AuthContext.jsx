import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('vc_token');
    const savedUser = localStorage.getItem('vc_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { user: userData, token: newToken } = response.data.data;
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('vc_token', newToken);
    localStorage.setItem('vc_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const { user: userData, token: newToken } = response.data.data;
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('vc_token', newToken);
    localStorage.setItem('vc_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vc_token');
    localStorage.removeItem('vc_user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('vc_user', JSON.stringify(userData));
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
