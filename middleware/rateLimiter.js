const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite cada IP a 5 solicitudes de inicio de sesión por ventana
    message: 'Demasiados intentos de inicio de sesión. Inténtelo de nuevo más tarde',
    standardHeaders: true, // Información del límite de tasa de retorno en los encabezados `RateLimit-*`
    legacyHeaders: false, // Deshabilite los encabezados `X-RateLimit-*`
});

module.exports = loginLimiter;