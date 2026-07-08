import express from 'express';
import type { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const myIP = '10.136.203.71';

// Local database configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sample_db',
    waitForConnections: true,
    connectionLimit: 10,
});

// Helper function for MD5 hashing
const md5Hash = (text: string): string => {
    return crypto.createHash('md5').update(text).digest('hex');
};

// Test endpoint
app.get('/api/test', (req: Request, res: Response) => {
    res.json({
        status: "Buhay ang Node.js backend ko!",
        oras: new Date().toLocaleTimeString()
    });
});

// LOGIN API ENDPOINT
app.post('/api/login', async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Wrong email or password.' });
        }

        const user = rows[0];
        const hashedInputPassword = md5Hash(password);

        if (hashedInputPassword !== user.password) {
            return res.status(400).json({ error: 'Wrong email or password.' });
        }

        return res.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
});

// REGISTER API ENDPOINT
app.post('/api/register', async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = md5Hash(password);

        await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        return res.status(201).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
});

// Get all users from the database
app.get('/api/users', async (req: Request, res: Response): Promise<any> => {
    try {
        const [rows]: any = await pool.query('SELECT * FROM users');
        return res.json({ success: true, users: rows });
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Server running at http://${myIP}:${PORT}`);
});
