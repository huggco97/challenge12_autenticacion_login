const jwt = require('jsonwebtoken');

// Middleware para verificar si el usuario está autenticado
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Token almacenado en cookies
    if (!token) {
        return res.status(403).send('Acceso denegado. Por favor intenta iniciar sesion de nuevo.');
    }

    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded; // Almacena los datos del usuario decodificados
        next();
    } catch (err) {
        res.status(400).send('token invalido.');
    }
};

// Middleware para verificar roles específicos
const verifyRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).send('Acceso denegado. permisos insuficiente.');
    }
    next();
};

module.exports = { verifyToken, verifyRole };
