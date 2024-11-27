const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const path = require('path');
const { connectDB } = require('./config');
const { initializeUserTable } = require('./models/User');

const app = express();
const csrfProtection = csrf({ cookie: true });

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
app.use(express.static(path.join(__dirname, 'public')));// Configuracion de archivos estaticos

// Conectar a PostgreSQL
connectDB();

// inicializar la tabla users
initializeUserTable();

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
// Rutas para usuarios y administradores
app.use('/', userRoutes);


//configuracion CSRF token 
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// iniciar server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
