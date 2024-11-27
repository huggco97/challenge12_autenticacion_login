const { pool } = require('../config');

// Función para crear la tabla si no existe
const initializeUserTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'Usuario',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(createTableQuery);
        console.log('La tabla de usuarios se inicializó correctamente.');
    } catch (error) {
        console.error('Error al inicializar la tabla de usuarios:', error);
    }
};

// Exportamos la función para inicializar la tabla
module.exports = { initializeUserTable };
