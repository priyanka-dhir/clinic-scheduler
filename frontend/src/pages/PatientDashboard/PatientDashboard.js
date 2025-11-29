import React from 'react';
import { clearAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleBookAppointment = () => {
    alert('Book Appointment clicked! (placeholder)');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Patient Dashboard</h1>
      <p>Welcome, patient!</p>

      <button 
        onClick={handleBookAppointment} 
        style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        Book Appointment
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

export default PatientDashboard;
