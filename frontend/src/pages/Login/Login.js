import React, { useState } from 'react';
import API from '../../api/axios';
import { setToken, setUserRole } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error
    try {
      const res = await API.post('/auth/login', { username, password });
      const { token, role } = res.data;

      // Save token and role in localStorage
      setToken(token);
      setUserRole(role);

      // Redirect based on role
      switch (role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'PROVIDER':
          navigate('/provider');
          break;
        case 'PATIENT':
          navigate('/patient');
          break;
        case 'SCHEDULER':
          navigate('/scheduler');
          break;
        default:
          navigate('/login'); // fallback
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>Login</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default Login;
