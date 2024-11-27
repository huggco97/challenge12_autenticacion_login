const express = require('express');
const path = require('path');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta para usuarios regulares
router.get('/user', verifyToken, verifyRole('Usuario'), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/user.html'));
});

// Ruta para administradores
router.get('/admin', verifyToken, verifyRole('Administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin.html'));
});

module.exports = router;
