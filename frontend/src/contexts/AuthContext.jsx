import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from local storage initially
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const companyLogin = async (email, password) => {
    const res = await api.post('/auth/company/login', { email, password });
    const { accessToken, member } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(member));
    setUser(member);
    return member;
  };

  const companyRegister = async (data) => {
    const res = await api.post('/auth/company/register', data);
    return res.data.data;
  };

  const candidateLogin = async (email, password) => {
    const res = await api.post('/auth/candidate/login', { email, password });
    const { accessToken, candidate } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(candidate));
    setUser(candidate);
    return candidate;
  };
  
  const candidateRegister = async (data) => {
    const res = await api.post('/auth/candidate/register', data);
    return res.data.data;
  };

  const logout = async () => {
    try {
      if (user?.role) {
        // is company member
        await api.post('/auth/company/logout');
      } else {
        await api.post('/auth/candidate/logout');
      }
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    companyLogin,
    companyRegister,
    candidateLogin,
    candidateRegister,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
