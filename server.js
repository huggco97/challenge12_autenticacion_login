
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = require('./routes/userRoutes')
const { connectDB } = require('./config');
const { initializeUserTable } = require('./models/User');
const app = express();
const csrfProtection = csrf({ cookie: true });
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
}));
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public'))); // Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, "views")));
// Conectar a PostgreSQL
connectDB();

// Inicializar la tabla de usuarios
initializeUserTable();

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/auth', authRoutes);

// Rutas para usuarios y administradores
app.use('/', userRoutes);

// Configuración CSRF token 
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;  // Tomamos el token de la cookie
    if (!token) return res.status(403).send('Acceso denegado. No se encontró el token.');

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = decoded;  // Guardamos la información del usuario decodificada en la solicitud
        next();  // Continuamos con la siguiente función o ruta
    });
};

// Ruta protegida para administradores
app.get('/admin', verifyToken, (req, res) => {
    if (req.user.role === 'admin') {
        res.sendFile(path.join(__dirname, 'views', 'admin.html'));
    } else {
        res.status(403).send('Acceso denegado');
    }
});

// Ruta protegida para usuarios
app.get('/user', verifyToken, (req, res) => {
    if (req.user.role === 'user') {
        res.sendFile(path.join(__dirname, 'views', 'user.html'));
    } else {
        res.status(403).send('Acceso denegado');
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
