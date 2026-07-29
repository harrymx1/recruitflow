import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import CompanyRegister from './pages/CompanyRegister';
import CompanyLogin from './pages/CompanyLogin';
import CompanyForgotPassword from './pages/CompanyForgotPassword';
import CompanyResetPassword from './pages/CompanyResetPassword';
import CandidateAuth from './pages/CandidateAuth';
import CandidateForgotPassword from './pages/CandidateForgotPassword';
import CandidateResetPassword from './pages/CandidateResetPassword';
import TeamManagement from './pages/TeamManagement';
import CompanyProfileEdit from './pages/CompanyProfileEdit';
import JobListings from './pages/JobListings';
import JobForm from './pages/JobForm';
import CompanyProfile from './pages/CompanyProfile';

const ProtectedCompanyRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role === undefined) {
    return <Navigate to="/company/login" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/candidate/auth" />} />
      <Route path="/company/register" element={<CompanyRegister />} />
      <Route path="/company/login" element={<CompanyLogin />} />
      <Route path="/company/forgot-password" element={<CompanyForgotPassword />} />
      <Route path="/company/reset-password" element={<CompanyResetPassword />} />
      <Route path="/company/:slug" element={<CompanyProfile />} />
      
      <Route path="/candidate/auth" element={<CandidateAuth />} />
      <Route path="/candidate/forgot-password" element={<CandidateForgotPassword />} />
      <Route path="/candidate/reset-password" element={<CandidateResetPassword />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedCompanyRoute>
          <Navigate to="/dashboard/jobs" />
        </ProtectedCompanyRoute>
      } />
      
      <Route path="/dashboard/team" element={
        <ProtectedCompanyRoute>
          <TeamManagement />
        </ProtectedCompanyRoute>
      } />

      <Route path="/dashboard/profile" element={
        <ProtectedCompanyRoute>
          <CompanyProfileEdit />
        </ProtectedCompanyRoute>
      } />

      <Route path="/dashboard/jobs" element={
        <ProtectedCompanyRoute>
          <JobListings />
        </ProtectedCompanyRoute>
      } />

      <Route path="/dashboard/jobs/new" element={
        <ProtectedCompanyRoute>
          <JobForm />
        </ProtectedCompanyRoute>
      } />

      <Route path="/dashboard/jobs/:id" element={
        <ProtectedCompanyRoute>
          <JobForm />
        </ProtectedCompanyRoute>
      } />
      
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
