// controllers/usuarios.js
import bcrypt from "bcrypt";
// controllers/usuarios.js
import { crearConexion } from "../database/database";

export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, apellidos, email, contrasena, celular, cedula } = req.body;
        const conexion = await crearConexion();

        // Verificar si el correo ya está registrado
        const [existingUser] = await conexion.query(`
            SELECT id FROM Usuarios WHERE email = ?
        `, [email]);

        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Insertar nuevo usuario en la base de datos sin encriptar la contraseña
        await conexion.query(`
            INSERT INTO Usuarios (nombre, apellidos, email, contrasena, celular, cedula) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nombre, apellidos, email, contrasena, celular, cedula]);

        // Obtener los datos del usuario recién registrado
        const [newUser] = await conexion.query(`
            SELECT id, nombre, apellidos, email FROM Usuarios WHERE email = ?
        `, [email]);

        const usuario = {
            id: newUser.id,
            nombre: newUser.nombre,
            apellidos: newUser.apellidos,
            email: newUser.email
        };

        console.log("Usuario registrado exitosamente:", usuario);

        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario });
    } catch (error) {
        console.error("Error en registrarUsuario:", error.message);
        res.status(500).json({ error: error.message });
    }
};
// Inicio de sesión de usuario
export const iniciarSesionUsuario = async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        const conexion = await crearConexion();

        // Consultar los datos del usuario por su correo electrónico
        const [rows] = await conexion.query(`
            SELECT id, nombre, apellidos, contrasena FROM Usuarios WHERE email = ?
        `, [email]);

        // Verificar si el usuario existe
        if (rows === undefined || rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Obtener los datos del usuario
        const user = rows;

        // Verificar si la contraseña ingresada coincide con la almacenada en la base de datos
        if (contrasena !== user.contrasena) {
            return res.status(401).json({ error: 'Credenciales inválidas' }); // Contraseña incorrecta
        }

        // Usuario autenticado, devuelve detalles del usuario
        const usuario = {
            id: user.id,
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: email
        };

        res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const realizarPrestamo = async (req, res) => {
    try {
        const { usuario_id, libro_id, numero_ejemplar, fecha_prestamo, fecha_devolucion } = req.body;
        const conexion = await crearConexion();
        console.log("usuario_id", usuario_id);
        console.log("libro_id", libro_id);
        console.log("numero_ejemplar", numero_ejemplar);
        console.log("fecha_prestamo", fecha_prestamo);
        console.log("fecha_devolucion", fecha_devolucion);

        // Llamar al procedimiento almacenado para registrar el préstamo
        const [result] = await conexion.query(
            'CALL RegistrarPrestamo(?, ?, ?, ?, ?)',
            [usuario_id, libro_id, numero_ejemplar, fecha_prestamo, fecha_devolucion]
        );

        console.log("prestamo_id: ", result[0].prestamo_id);
        res.status(200).json({ message: 'Préstamo registrado exitosamente', prestamoId: result[0].prestamo_id });
    } catch (error) {
        console.error("Error en realizarPrestamo:", error.message);
        res.status(500).json({ error: error.sqlMessage });
    }
};




export const obtenerPrestamosActivosUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const conexion = await crearConexion();

        
        /**
         * Consulta para recuperar los préstamos activos de un usuario específico.
         * Esta consulta selecciona el ID del préstamo, el ID del libro, el título del libro, el número de copia, la fecha de préstamo, la fecha de devolución y el estado del préstamo
         * de la tabla Préstamos, uniéndola con la tabla Libros para obtener el título del libro.
         * Filtra los resultados por el ID del usuario y el estado del préstamo que sea 'activo'.
         */
        
        const query = `
            SELECT P.id, P.libro_id, L.titulo AS libro_titulo, P.numero_ejemplar, P.fecha_prestamo, P.fecha_devolucion, P.estado
            FROM Prestamos P
            JOIN Libros L ON P.libro_id = L.id
            WHERE P.usuario_id = ? AND p.estado = 'activo'
        `;

        const rows = await conexion.query(query, [usuario_id]);
        // console.log("rows", rows);
        if (rows === undefined) {
            res.status(404).json({ error: `No se encontraron préstamos para el usuario con id ${usuario_id}` });
            return;
        }
        console.log("rows", rows);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los préstamos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener los préstamos del usuario' });
    }
};


export const devolverPrestamo = async (req, res) => {
    try {
        const { prestamoId } = req.params;
        const conexion = await crearConexion();


        // Llamar al procedimiento almacenado para devolver el préstamo
        await conexion.query(`CALL DevolverPrestamo(?)`, [prestamoId]);



        res.status(200).json({ message: 'Libro devuelto exitosamente' });
    } catch (error) {
        console.error("Error en devolverLibro:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Dejar opinión sobre un libro prestado
export const dejarOpinion = async (req, res) => {
    const { usuario_id, libro_id, opinion } = req.body;
    const fecha_opinion = new Date().toISOString().split('T')[0]; // Obtener la fecha actual
    try {
        const conexion = await crearConexion();
        // Llamar al procedimiento almacenado para dejar la opinión
        await conexion.query(' CALL dejarOpinion(?, ?, ?, ?)', [usuario_id, libro_id, opinion, fecha_opinion]);
        
        res.status(201).json({ message: 'Opinión registrada exitosamente' });

    } catch (error) {
        console.error('Error al dejar la opinión:', error);
        res.status(500).json({ error: error.sqlMessage || 'Error al dejar la opinión' });

    }
}

// Obtener opiniones de un libro específico
export const obtenerOpinionLibro = async (req, res) => {
    const { libro_id } = req.params;

    try {
        const conexion = await crearConexion();

       
        /**
         * Consulta para obtener las opiniones de un libro específico.
         * Esta consulta selecciona el ID de la opinión, el contenido de la opinión, la fecha de la opinión y el nombre del usuario que dejó la opinión.
         * Se une la tabla de Opiniones con la tabla de Usuarios utilizando el ID de usuario para obtener el nombre del usuario.
         * Filtra los resultados por el ID del libro.
         */
        const rows = await conexion.query(`
            SELECT o.id, o.opinion, o.fecha_opinion, u.nombre AS nombreUsuario
            FROM Opiniones o
            JOIN Usuarios u ON o.usuario_id = u.id
            WHERE o.libro_id = ?
        `, [libro_id]);

        if (rows === undefined) {
            return res.status(404).json({ error: 'No se encontraron opiniones para este libro.' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las opiniones del libro:', error);
        res.status(500).json({ error: 'Error al obtener las opiniones del libro' });
    }
};
