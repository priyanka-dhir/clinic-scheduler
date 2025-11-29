import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard/ProviderDashboard';
import PatientDashboard from './pages/PatientDashboard/PatientDashboard';
import SchedulerDashboard from './pages/SchedulerDashboard/SchedulerDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Role-based protected routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider"
          element={
            <PrivateRoute roles={['PROVIDER']}>
              <ProviderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient"
          element={
            <PrivateRoute roles={['PATIENT']}>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/scheduler"
          element={
            <PrivateRoute roles={['SCHEDULER']}>
              <SchedulerDashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
