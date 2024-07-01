// controllers/administradores.js

import { crearConexion } from "../database/database";

// Inicio de sesión de administrador
export const iniciarSesionAdmin = async (req, res) => {
    const { usuario, contrasena } = req.body;

    let conexion
    try {
        conexion = await crearConexion();
        const query = `SELECT * FROM administradores WHERE usuario = ?`;
        const result = await conexion.query(query, [usuario]);

        console.log('result:', result);

        if (result.length > 0) {
            const admin = result[0];

            // Verificar la contraseña (aquí debes implementar tu lógica para comparar la contraseña)
            if (admin.contrasena === contrasena) {
                // Autenticación exitosa
                res.status(200).json({ mensaje: 'Inicio de sesión exitoso', admin });
            } else {
                // Contraseña incorrecta
                res.status(401).json({ error: 'Contraseña incorrecta' });
            }
        } else {
            // Administrador no encontrado
            res.status(404).json({ error: 'Administrador no encontrado' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener usuarios registrados
export const obtenerUsuariosRegistrados = async (req, res) => {
    let conexion;
    try {
        conexion = await crearConexion();
        const query = `SELECT * FROM usuarios`;
        const usuarios = await conexion.query(query);

        res.status(200).json(usuarios); // Envía la lista de usuarios como respuesta

    } catch (error) {
        res.status(500).json({ error: error.message });
        // } finally {
        //     if (conexion) {
        //         conexion.end(); // Cierra la conexión a la base de datos al finalizar la operación
        //     }
    }
};


// Agregar usuario
export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    let conexion;
    try {
        conexion = await crearConexion();
        const query = `DELETE FROM usuarios WHERE id = ?`;
        await conexion.query(query, [id]);
        res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene préstamos asociados.' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// editar usuario:
export const editarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, email, celular, cedula } = req.body;
    let conexion;
    try {
        conexion = await crearConexion();
        const query = `UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, celular = ?, cedula = ? WHERE id = ?`;
        await conexion.query(query, [nombre, apellidos, email, celular, cedula, id]);
        res.status(200).json({ mensaje: 'Usuario editado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// controllers/libros.js


export const obtenerLibrosConEjemplares = async (req, res) => {
    try {
        const conexion = await crearConexion();
        const query = `
            SELECT l.id, l.titulo, l.imagen_url, l.editorial, l.ano, l.idioma, l.npaginas, l.isbn13,
                   (SELECT GROUP_CONCAT(a.nombre SEPARATOR ', ') FROM LibroAutores la INNER JOIN Autores a ON la.autor_id = a.id WHERE la.libro_id = l.id) AS autores,
                   (SELECT GROUP_CONCAT(c.nombre SEPARATOR ', ') FROM LibroCategorias lc INNER JOIN Categorias c ON lc.categoria_id = c.id WHERE lc.libro_id = l.id) AS categorias,
                   (SELECT COUNT(*) FROM Ejemplares e WHERE e.libro_id = l.id) AS num_ejemplares
            FROM Libros l;
        `;
        const libros = await conexion.query(query);
        res.status(200).json(libros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// agregar categoria 
export const agregarCategoria = async (req, res) => {
    const { nombre } = req.body;
    let conexion;
    try {
        conexion = await crearConexion();
        const query = `INSERT INTO categorias (nombre) VALUES (?)`;
        await conexion.query(query, [nombre]);
        res.status(201).json({ mensaje: 'Categoría agregada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// obtener las categorias de los libros

export const obtenerCategorias = async (req, res) => {
    try {
        const conexion = await crearConexion();
        const query = `SELECT * FROM categorias`;
        const categorias = await conexion.query(query);
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Editar categoría
export const editarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    let conexion;
    try {
        conexion = await crearConexion();
        const query = `UPDATE categorias SET nombre = ? WHERE id = ?`;
        await conexion.query(query, [nombre, id]);
        res.status(200).json({ mensaje: 'Categoría editada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar categoría
export const eliminarCategoria = async (req, res) => {
    const { id } = req.params;
    let conexion;
    try {
        conexion = await crearConexion();
        const query = `DELETE FROM categorias WHERE id = ?`;
        await conexion.query(query, [id]);
        res.status(200).json({ mensaje: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar autor

export const agregarAutor = async (req, res) => {
    const { nombre, nacionalidad } = req.body;
    let conexion;
    console.log('nombre:', nombre, 'nacionalidad:', nacionalidad);

    try {
        conexion = await crearConexion();
        const query = 'INSERT INTO Autores (nombre, nacionalidad) VALUES (?, ?)';
        const result = await conexion.query(query, [nombre, nacionalidad]);
        console.log('Autor agregado:', result);

        res.status(201).json({ id: result.insertId, nombre, nacionalidad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener autores
export const obtenerAutores = async (req, res) => {
    try {
        const conexion = await crearConexion();
        const query = `SELECT * FROM autores`;
        const autores = await conexion.query(query);
        res.status(200).json(autores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Editar autor
export const editarAutor = async (req, res) => {
    const { id } = req.params;
    const { nombre, nacionalidad } = req.body;
    let conexion;
    try {
        conexion = await crearConexion();
        const query = 'UPDATE Autores SET nombre = ?, nacionalidad = ? WHERE id = ?';
        await conexion.query(query, [nombre, nacionalidad, id]);
        res.status(200).json({ id, nombre, nacionalidad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar autor

export const eliminarAutor = async (req, res) => {
    const { id } = req.params;
    let conexion;

    try {
        conexion = await crearConexion();

        // Verificar si el autor está asociado a algún libro
        const librosAsociados = await conexion.query('SELECT * FROM LibroAutores WHERE autor_id = ?', [id]);
        if (librosAsociados.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar el autor porque está asociado a uno o más libros' });
        }
        console.log('librosAsociados:', librosAsociados.length);
        // Si no hay asociaciones, proceder con la eliminación
        const query = 'DELETE FROM Autores WHERE id = ?';
        await conexion.query(query, [id]);
        res.status(200).json({ mensaje: 'Autor eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const agregarLibroConEjemplares = async (req, res) => {
    const { titulo, imagen_url, editorial, ano, idioma, npaginas, isbn13, autores, categorias, cantidad_ejemplares } = req.body;

    let conexion;
    try {
        conexion = await crearConexion();
        await conexion.beginTransaction();

        // Insertar el libro en la tabla Libros
        const queryLibro = `
            INSERT INTO Libros (titulo, imagen_url, editorial, ano, idioma, npaginas, isbn13)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const resultLibro = await conexion.query(queryLibro, [titulo, imagen_url, editorial, ano, idioma, npaginas, isbn13]);
        const libroId = resultLibro.insertId;

        // Insertar los autores del libro en la tabla LibroAutores
        if (autores && autores.length > 0) {
            const valuesAutores = autores.map(autorId => [libroId, autorId]);
            const queryAutores = `
                INSERT INTO LibroAutores (libro_id, autor_id)
                VALUES ?
            `;
            await conexion.query(queryAutores, [valuesAutores]);
        }

        // Insertar las categorías del libro en la tabla LibroCategorias
        if (categorias && categorias.length > 0) {
            const valuesCategorias = categorias.map(categoriaId => [libroId, categoriaId]);
            const queryCategorias = `
                INSERT INTO LibroCategorias (libro_id, categoria_id)
                VALUES ?
            `;
            await conexion.query(queryCategorias, [valuesCategorias]);
        }

        /// Obtener el último número de ejemplar para este libro
        const queryUltimoEjemplar = `
                    SELECT IFNULL(MAX(numero_ejemplar), 0) AS ultimo_numero
                    FROM Ejemplares
                    WHERE libro_id = ?
                    `;
        const resultUltimoEjemplar = await conexion.query(queryUltimoEjemplar, [libroId]);
        let ultimoNumeroEjemplar = resultUltimoEjemplar[0].ultimo_numero || 0;

        // Insertar los ejemplares del libro en la tabla Ejemplares
        if (cantidad_ejemplares && cantidad_ejemplares > 0) {
            const valuesEjemplares = [];
            for (let i = 1; i <= cantidad_ejemplares; i++) {
                valuesEjemplares.push([libroId, ultimoNumeroEjemplar + i, 'disponible']);
            }
            const queryEjemplares = `
                INSERT INTO Ejemplares (libro_id, numero_ejemplar, estado)
                VALUES ?
            `;
            await conexion.query(queryEjemplares, [valuesEjemplares]);
        }

        await conexion.commit();
        res.status(201).json({ mensaje: 'Libro y ejemplares agregados exitosamente' });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    }
};

export const agregarEjemplar = async (req, res) => {
    try {
        // Lógica para agregar un nuevo ejemplar de un libro al inventario de la biblioteca
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const eliminarEjemplar = async (req, res) => {
    try {
        // Lógica para eliminar un ejemplar de un libro del inventario de la biblioteca
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Actualizar información de un libro existente
export const actualizarLibro = async (req, res) => {
    try {
        // Lógica para actualizar la información de un libro en el inventario
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar libro del inventario
export const eliminarLibro = async (req, res) => {
    try {
        // Lógica para eliminar un libro del inventario de la biblioteca
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// PRESTAMOS 

export const obtenerPrestamosUsuario = async (req, res) => {
    try {
        const conexion = await crearConexion();
        const query = `
 SELECT p.id, p.fecha_prestamo, p.fecha_devolucion, p.estado, u.nombre, u.apellidos, u.email, l.titulo
            FROM Prestamos p
            INNER JOIN Usuarios u ON p.usuario_id = u.id
            INNER JOIN Libros l ON p.libro_id = l.id
        `;
        const prestamos = await conexion.query(query);
        res.status(200).json(prestamos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const cambiarEstadoPrestamo = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    console.log('id:', id, 'estado:', estado);
    let conexion;
    try {
        conexion = await crearConexion();
        const query = `UPDATE Prestamos SET estado = ? WHERE id = ?`;
        await conexion.query(query, [estado, id]);
        res.status(200).json({ mensaje: 'Estado del préstamo actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


}