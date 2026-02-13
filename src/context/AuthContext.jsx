import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Decodificar token y obtener usuario
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.nameid,
          email: payload.email,
          nombre: payload.unique_name
        });
      } catch (error) {
        console.error('Token inválido', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (authData) => {
    setToken(authData.token);
    setUser({
      id: authData.id,
      email: authData.email,
      nombre: authData.nombre
    });
    localStorage.setItem('token', authData.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};