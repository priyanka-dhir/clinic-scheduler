import React from 'react';
import { clearAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const SchedulerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleApproveRequests = () => {
    alert('Approve Requests clicked! (placeholder)');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Scheduler Dashboard</h1>
      <p>Welcome, scheduler!</p>

      <button 
        onClick={handleApproveRequests} 
        style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        Approve Requests
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

export default SchedulerDashboard;
