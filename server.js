import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'event_ticketing',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        qr_data VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDB();

app.get('/api/registrations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching registrations' });
  }
});

app.post('/api/registrations', async (req, res) => {
  const { name, phone, qrData } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO registrations (name, phone, qr_data) VALUES (?, ?, ?)',
      [name, phone, qrData]
    );
    res.json({ id: result.insertId, name, phone, qrData });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'ALREADY REGISTERED' });
    } else {
      res.status(500).json({ error: 'Error creating registration' });
    }
  }
});

app.delete('/api/registrations/:qrData', async (req, res) => {
  try {
    await pool.query('DELETE FROM registrations WHERE qr_data = ?', [req.params.qrData]);
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting registration' });
  }
});

app.get('/api/verify/:qrData', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM registrations WHERE qr_data = ?', [req.params.qrData]);
    res.json({ isValid: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying QR code' });
  }
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log(`Server running on port http://${HOST}:${PORT}`);
});


