const pool = require('../db');

const getAllPatients = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, u.username, u.email, p.dob, p.gender, p.insurance_provider
      FROM patients p
      JOIN users u ON p.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT p.id, u.username, u.email, p.dob, p.gender, p.insurance_provider
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (!rows.length) return res.status(404).json({ message: 'Patient not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPatient = async (req, res) => {
  const { username, password, email, dob, gender, insurance_provider } = req.body;

  try {
    // 1. Create user account first
    const passwordHash = await require('bcryptjs').hash(password, 12);

    const [userResult] = await pool.query(
      'INSERT INTO users (username, password_hash, role, email) VALUES (?, ?, ?, ?)',
      [username, passwordHash, 'PATIENT', email]
    );

    const userId = userResult.insertId;

    // 2. Insert into patients table
    const [patientResult] = await pool.query(
      'INSERT INTO patients (user_id, dob, gender, insurance_provider) VALUES (?, ?, ?, ?)',
      [userId, dob, gender, insurance_provider]
    );

    res.status(201).json({
      message: 'Patient created successfully',
      patientId: patientResult.insertId,
      userId: userId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating patient' });
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { dob, gender, insurance_provider } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE patients SET dob = ?, gender = ?, insurance_provider = ? WHERE id = ?',
      [dob, gender, insurance_provider, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Patient not found' });

    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating patient' });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    // Get existing user_id linked to patient
    const [rows] = await pool.query('SELECT user_id FROM patients WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Patient not found' });

    const userId = rows[0].user_id;

    // Delete patient row
    await pool.query('DELETE FROM patients WHERE id = ?', [id]);

    // Delete user row
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'Patient and user removed successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting patient' });
  }
};

module.exports = { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient };
