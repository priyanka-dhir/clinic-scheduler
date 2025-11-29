const pool = require('../db');

const getAllRooms = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createRoom = async (req, res) => {
  const { name, type, capacity } = req.body;
  try {
    await pool.query('INSERT INTO rooms (name, type, capacity) VALUES (?, ?, ?)', [name, type, capacity]);
    res.status(201).json({ message: 'Room created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name, type, capacity } = req.body;
  try {
    await pool.query('UPDATE rooms SET name = ?, type = ?, capacity = ? WHERE id = ?', [name, type, capacity, id]);
    res.json({ message: 'Room updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllRooms, createRoom, updateRoom, deleteRoom };
