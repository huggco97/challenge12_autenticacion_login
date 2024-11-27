const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config');

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3) RETURNING id`;
        const values = [email, hashedPassword, role || 'Usuario'];

        const result = await pool.query(query, values);
        res.status(201).send(`User registered with ID: ${result.rows[0].id}`);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error registering user');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const query = `SELECT * FROM users WHERE email = $1`;
        const values = [email];

        const result = await pool.query(query, values);
        const user = result.rows[0];

        if (!user) return res.status(404).send('User not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user.id, role: user.role }, 'secretKey', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.status(200).send('Login successful');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
};
