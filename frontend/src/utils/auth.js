// Save token
export const setToken = (token) => localStorage.setItem('token', token);

// Get token
export const getToken = () => localStorage.getItem('token');

// Save user role
export const setUserRole = (role) => localStorage.setItem('role', role);

// Get user role
export const getUserRole = () => localStorage.getItem('role');

// Clear all auth data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
