const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({
            status: 'Required fields missing',
            status_code: 400
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);

        res.status(200).json({
            status: 'Account successfully created',
            status_code: 200,
            user_id: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'Username or email already exists',
                status_code: 409
            });
        }
        res.status(500).json({
            status: 'Database error',
            status_code: 500
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            status: 'Missing required fields',
            status_code: 400
        });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({
                status: 'Incorrect username/password provided. Please retry',
                status_code: 401
            });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'Incorrect username/password provided. Please retry',
                status_code: 401
            });
        }

        const token = jwt.sign({ user_id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            status: 'Login successful',
            status_code: 200,
            user_id: user.id,
            access_token: token
        });

    } catch (err) {
        res.status(500).json({
            status: 'Database error',
            status_code: 500
        });
    }
};
