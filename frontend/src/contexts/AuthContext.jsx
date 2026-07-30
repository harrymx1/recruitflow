import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from local storage initially
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const companyLogin = async (email, password) => {
    const res = await api.post('/auth/company/login', { email, password });
    const { accessToken, member } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(member));
    setToken(accessToken);
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
    setToken(accessToken);
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
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    companyLogin,
    companyRegister,
    candidateLogin,
    candidateRegister,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
