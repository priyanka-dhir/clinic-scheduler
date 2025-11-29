const pool = require('../db');

// Get all providers
const getAllProviders = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT p.id, u.username, u.email, p.specialty, p.timezone FROM providers p JOIN users u ON p.user_id = u.id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get provider by ID
const getProviderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT p.id, u.username, u.email, p.specialty, p.timezone FROM providers p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Provider not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create provider
const createProvider = async (req, res) => {
  const { user_id, specialty, timezone } = req.body;
  try {
    await pool.query('INSERT INTO providers (user_id, specialty, timezone) VALUES (?, ?, ?)', [user_id, specialty, timezone]);
    res.status(201).json({ message: 'Provider created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update provider
const updateProvider = async (req, res) => {
  const { id } = req.params;
  const { specialty, timezone } = req.body;
  try {
    await pool.query('UPDATE providers SET specialty = ?, timezone = ? WHERE id = ?', [specialty, timezone, id]);
    res.json({ message: 'Provider updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete provider
const deleteProvider = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM providers WHERE id = ?', [id]);
    res.json({ message: 'Provider deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
};
