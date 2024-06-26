// controllers/usuarios.js
import bcrypt from "bcrypt";
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

        // Encriptar la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(contrasena, 10); // Utiliza bcrypt para generar un hash seguro

        // Insertar nuevo usuario en la base de datos con la contraseña encriptada
        await conexion.query(`
            INSERT INTO Usuarios (nombre, apellidos, email, contrasena, celular, cedula) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nombre, apellidos, email, hashedPassword, celular, cedula]);

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


        const [rows] = await conexion.query(`
            SELECT id, nombre, apellidos, contrasena FROM Usuarios WHERE email = ?
        `, [email]);


        if (rows === undefined || rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = rows;

        // Compara la contraseña ingresada con el hash almacenado en la base de datos
        const match = await bcrypt.compare(contrasena, user.contrasena); // Compara la contraseña con el hash almacenado
        if (!match) {
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


// export const realizarPrestamo = async (req, res) => {
//     try {
//         const { usuario_id, libro_id } = req.body;
//         const fecha_prestamo = new Date();
//         const fecha_devolucion = new Date();
//         fecha_devolucion.setDate(fecha_prestamo.getDate() + 21); // 21 días después

//         const conexion = await crearConexion();

//         await conexion.query(`CALL RegistrarPrestamo(?, ?, ?, ?)`, [
//             usuario_id,
//             libro_id,
//             fecha_prestamo,
//             fecha_devolucion
//         ]);

//         res.status(201).json({ message: 'Préstamo realizado exitosamente' });
//     } catch (error) {
//         console.error("Error en realizarPrestamo:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// };


export const obtenerPrestamosUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const conexion = await crearConexion();

        // Consulta para obtener los préstamos del usuario
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
        console.error('Error al obtener losddasd préstamos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener los préstamos del usuario' });
    }
};
// Obtener préstamos de un usuario
// export const obtenerPrestamosUsuario = async (req, res) => {
// try {
//     const { usuario_id } = req.params;
//     const conexion = await crearConexion();

//     const rows = await conexion.query(`
//         SELECT p.id, u.nombre AS nombreUsuario, l.titulo AS tituloLibro, p.estado, p.fecha_devolucion
//         FROM Prestamos p
//         JOIN Usuarios u ON p.usuario_id = u.id
//         JOIN Libros l ON p.libro_id = l.id
//         WHERE p.usuario_id = ? AND p.estado = 'activo' 
//     `, [usuario_id]);



//     if (rows  ===  undefined || rows.length === 0) {
//         return res.status(404).json({ error: 'No se encontraron préstamos para este usuario.' });
//     }


//     res.status(200).json(rows);
// } catch (error) {
//     console.error("Error en obtenerPrestamosUsuario:", error.message);
//     res.status(500).json({ error: error.message });
// }
// };


export const devolverPrestamo = async (req, res) => {
    try {
        const { prestamoId } = req.params;
        const conexion = await crearConexion();


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

        // Consulta para obtener las opiniones del libro
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
