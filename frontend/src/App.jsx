import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import JobPipeline from './pages/JobPipeline';
import CompanyProfile from './pages/CompanyProfile';
import LandingPage from './pages/LandingPage';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import CompanyLanding from './pages/CompanyLanding';
import Pricing from './pages/Pricing';
import CandidateLayout from './components/CandidateLayout';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateSavedJobs from './pages/CandidateSavedJobs';
import CandidateProfile from './pages/CandidateProfile';
import CandidateDocuments from './pages/CandidateDocuments';
import JobApply from './pages/JobApply';
import CandidateApplicationDetail from './pages/CandidateApplicationDetail';
import DashboardCandidates from './pages/DashboardCandidates';
import DashboardApplicationDetail from './pages/DashboardApplicationDetail';
import DashboardInterviews from './pages/DashboardInterviews';
import DashboardTags from './pages/DashboardTags';
import DashboardEmailTemplates from './pages/DashboardEmailTemplates';
import HRDashboard from './pages/HRDashboard';

const ProtectedCompanyRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role === undefined) {
    return <Navigate to="/company/login" />;
  }
  return children;
};

const ProtectedCandidateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'candidate') {
    return <Navigate to="/candidate/auth" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cari-lowongan" element={<JobBoard />} />
      <Route path="/untuk-perusahaan" element={<CompanyLanding />} />
      <Route path="/harga" element={<Pricing />} />
      <Route path="/jobs/:jobId" element={<JobDetail />} />
      <Route path="/company/register" element={<CompanyRegister />} />
      <Route path="/company/login" element={<CompanyLogin />} />
      <Route path="/company/forgot-password" element={<CompanyForgotPassword />} />
      <Route path="/company/reset-password" element={<CompanyResetPassword />} />
      <Route path="/company/:slug" element={<CompanyProfile />} />

      <Route path="/candidate/auth" element={<CandidateAuth />} />
      <Route path="/candidate/forgot-password" element={<CandidateForgotPassword />} />
      <Route path="/candidate/reset-password" element={<CandidateResetPassword />} />

      {/* Protected Candidate Routes */}
      <Route element={<ProtectedCandidateRoute><CandidateLayout /></ProtectedCandidateRoute>}>
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/saved-jobs" element={<CandidateSavedJobs />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/documents" element={<CandidateDocuments />} />
        <Route path="/candidate/applications/:id" element={<CandidateApplicationDetail />} />
      </Route>

      {/* Protected Candidate Routes (No CandidateLayout) */}
      <Route element={<ProtectedCandidateRoute><Outlet /></ProtectedCandidateRoute>}>
        <Route path="/jobs/:jobId/apply" element={<JobApply />} />
      </Route>

      <Route path="/dashboard" element={
        <ProtectedCompanyRoute>
          <HRDashboard />
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

      <Route path="/dashboard/pipeline/:id" element={
        <ProtectedCompanyRoute>
          <JobPipeline />
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

      {/* Sprint 6: HR Candidate Management */}
      <Route path="/dashboard/candidates" element={
        <ProtectedCompanyRoute>
          <DashboardCandidates />
        </ProtectedCompanyRoute>
      } />
      <Route path="/dashboard/applications/:id" element={
        <ProtectedCompanyRoute>
          <DashboardApplicationDetail />
        </ProtectedCompanyRoute>
      } />
      <Route path="/dashboard/interviews" element={
        <ProtectedCompanyRoute>
          <DashboardInterviews />
        </ProtectedCompanyRoute>
      } />
      <Route path="/dashboard/tags" element={
        <ProtectedCompanyRoute>
          <DashboardTags />
        </ProtectedCompanyRoute>
      } />
      <Route path="/dashboard/email-templates" element={
        <ProtectedCompanyRoute>
          <DashboardEmailTemplates />
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
