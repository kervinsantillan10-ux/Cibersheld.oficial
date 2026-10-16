const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta POST para registrar un nuevo usuario
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Encriptar la contraseña por seguridad
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        
        db.run(query, [name, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado.' });
                }
                return res.status(500).json({ success: false, message: 'Error en el servidor al registrar el usuario.' });
            }

            return res.status(201).json({ 
                success: true, 
                message: '¡Usuario registrado exitosamente en Cibershield!',
                userId: this.lastID 
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor de Cibershield corriendo en http://localhost:${PORT}`);
});