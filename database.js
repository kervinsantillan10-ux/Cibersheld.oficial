const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conexión a la base de datos SQLite (se crea un archivo local llamado cibershield.db)
const dbPath = path.resolve(__dirname, 'cibershield.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite de Cibershield.');
    }
});

// Crear la tabla de usuarios si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message);
        } else {
            console.log('Tabla "users" verificada o creada exitosamente.');
        }
    });
});

module.exports = db;