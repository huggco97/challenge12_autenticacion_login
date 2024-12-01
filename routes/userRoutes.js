const express = require('express');
const path = require('path');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { pool } = require('../config');
const router = express.Router();

// Ruta para usuarios regulares
router.get('/user', verifyToken, verifyRole('Usuario'), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/user.html'));
});

// Ruta para administradores
router.get('/admin', verifyToken, verifyRole('Administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin.html'));

});

router.get('/admin-users', verifyToken, verifyRole('Administrador'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, role FROM users');
        const users = result.rows;
        console.log(users)
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los usuarios');
    }
});

module.exports = router;
