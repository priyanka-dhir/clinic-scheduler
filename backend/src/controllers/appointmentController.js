const pool = require('../db');

// Helper: Check provider availability for a time range
const isProviderAvailable = async (provider_id, start_time, end_time, excludeAppointmentId = null) => {
  const [rows] = await pool.query(
    `SELECT id FROM appointments 
     WHERE provider_id = ? 
       AND NOT (end_time <= ? OR start_time >= ?)
       ${excludeAppointmentId ? 'AND id != ?' : ''}`,
    excludeAppointmentId ? [provider_id, start_time, end_time, excludeAppointmentId] : [provider_id, start_time, end_time]
  );
  return rows.length === 0;
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, p.id as patient_id, u1.username as patient_name, pr.id as provider_id, u2.username as provider_name, 
        r.id as room_id, r.name as room_name, a.start_time, a.end_time, a.status, a.version
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN users u1 ON p.user_id = u1.id
       JOIN providers pr ON a.provider_id = pr.id
       JOIN users u2 ON pr.user_id = u2.id
       LEFT JOIN rooms r ON a.room_id = r.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT a.id, p.id as patient_id, u1.username as patient_name, pr.id as provider_id, u2.username as provider_name, 
        r.id as room_id, r.name as room_name, a.start_time, a.end_time, a.status, a.version
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN users u1 ON p.user_id = u1.id
       JOIN providers pr ON a.provider_id = pr.id
       JOIN users u2 ON pr.user_id = u2.id
       LEFT JOIN rooms r ON a.room_id = r.id
       WHERE a.id = ?`,
       [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Appointment not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create appointment with provider availability check
const createAppointment = async (req, res) => {
  const { patient_id, provider_id, room_id, start_time, end_time, status } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check provider availability
    const providerFree = await isProviderAvailable(provider_id, start_time, end_time);
    if (!providerFree) {
      await connection.rollback();
      return res.status(409).json({ message: 'Provider is already booked for this time range' });
    }

    await connection.query(
      'INSERT INTO appointments (patient_id, provider_id, room_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, provider_id, room_id || null, start_time, end_time, status || 'SCHEDULED']
    );

    await connection.commit();
    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

// Update appointment with provider availability check and optimistic locking
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { patient_id, provider_id, room_id, start_time, end_time, status, version } = req.body;

  if (!version) return res.status(400).json({ message: 'Version is required for concurrency control' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check current version
    const [rows] = await connection.query('SELECT version FROM appointments WHERE id = ?', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (rows[0].version !== version) {
      await connection.rollback();
      return res.status(409).json({ message: 'Appointment was updated by another user. Please refresh.' });
    }

    // Check provider availability
    const providerFree = await isProviderAvailable(provider_id, start_time, end_time, id);
    if (!providerFree) {
      await connection.rollback();
      return res.status(409).json({ message: 'Provider is already booked for this time range' });
    }

    await connection.query(
      `UPDATE appointments 
       SET patient_id=?, provider_id=?, room_id=?, start_time=?, end_time=?, status=?, version=version+1
       WHERE id=? AND version=?`,
      [patient_id, provider_id, room_id || null, start_time, end_time, status, id, version]
    );

    await connection.commit();
    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM appointments WHERE id=?', [id]);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        a.id, a.start_time, a.end_time, a.status, a.patient_id, a.provider_id, a.room_id,
        p.user_id AS patient_user_id, u1.username AS patient_name,
        pr.user_id AS provider_user_id, u2.username AS provider_name,
        r.name AS room_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u1 ON p.user_id = u1.id
      JOIN providers pr ON a.provider_id = pr.id
      JOIN users u2 ON pr.user_id = u2.id
      LEFT JOIN rooms r ON a.room_id = r.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
