const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config');

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verificar si el correo ya existe
        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const checkEmailResult = await pool.query(checkEmailQuery, [email]);

        if (checkEmailResult.rows.length > 0) {
            return res.status(400).send('El correo electrónico ya está registrado');
        }

        const query = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3) RETURNING id`;
        const values = [email, hashedPassword, role || 'Usuario'];

        const result = await pool.query(query, values);
        res.status(201).send(`Usuario registrado con ID: ${result.rows[0].id}`);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error al registrar usuario');
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        const query = `SELECT * FROM users WHERE email = $1`;
        const values = [email];

        const result = await pool.query(query, values);
        const user = result.rows[0];

        if (!user) return res.status(404).send('Usuario no encontrado');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Credenciales Invalidas');

        // Determinar la expiración del token según el valor de 'rememberMe'
        const expiresIn = rememberMe ? '7d' : '1h';

        const token = jwt.sign({ id: user.id, role: user.role }, 'secretKey', { expiresIn });

        // Establecer la cookie con el token
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: true, // Esto requiere HTTPS en producción, si es local usa secure: false
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000 // 7 días o 1 hora
        });

        // Verificar el valor de 'role' y redirigir según el caso
        console.log('Rol del usuario:', user.role);  // Verifica el valor de role

        if (user.role === 'Administrador') {
            console.log('Redirigiendo a /admin');
            return res.redirect('/admin');
        } else {
            console.log('Redirigiendo a /user');
            return res.redirect('/user');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al iniciar sesión');
    }
};
