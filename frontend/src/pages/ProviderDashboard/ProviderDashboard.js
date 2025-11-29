import React from 'react';
import { clearAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleViewAppointments = () => {
    alert('View Appointments clicked! (placeholder)');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Provider Dashboard</h1>
      <p>Welcome, provider!</p>

      <button 
        onClick={handleViewAppointments} 
        style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        View Appointments
      </button>

      <br />
      <button 
        onClick={handleLogout} 
        style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
};

export default ProviderDashboard;
