import { crearConexion } from "../database/database";

export const obtenerLibros = async (req, res) => {
    let conexion;

    try {
        conexion = await crearConexion();

        const rows = await conexion.query(`
        SELECT 
            L.id, L.titulo, L.imagen_url, L.editorial, L.ano, L.idioma, L.npaginas, L.isbn13,
            GROUP_CONCAT(DISTINCT A.nombre SEPARATOR ', ') AS autores, 
            GROUP_CONCAT(C.nombre SEPARATOR ', ') AS categorias
        FROM Libros L
        LEFT JOIN LibroAutores LA ON L.id = LA.libro_id
        LEFT JOIN Autores A ON LA.autor_id = A.id
        LEFT JOIN LibroCategorias LC ON L.id = LC.libro_id
        LEFT JOIN Categorias C ON LC.categoria_id = C.id
        GROUP BY L.id 

        `);

        const libros = rows.map(row => ({
            id: row.id,
            titulo: row.titulo,
            imagen_url: row.imagen_url,
            editorial: row.editorial,
            ano: row.ano,
            idioma: row.idioma,
            npaginas: row.npaginas,
            isbn13: row.isbn13,
            autores: row.autores ? row.autores.split(', ') : [], // Lista de autores
            categorias: row.categorias ? row.categorias.split(', ') : []
        }));
        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerLibroPorId = async (req, res) => {
    let conexion;
    try {
        const { id } = req.params;
        conexion = await crearConexion();

        const rows = await conexion.query(`
            SELECT 
                L.id, L.titulo, L.imagen_url, L.editorial, L.ano, L.idioma, L.npaginas, L.isbn13,
                GROUP_CONCAT(DISTINCT A.nombre SEPARATOR ', ') AS autores,
                GROUP_CONCAT(C.nombre SEPARATOR ', ') AS categorias
            FROM Libros L
            LEFT JOIN LibroAutores LA ON L.id = LA.libro_id
            LEFT JOIN Autores A ON LA.autor_id = A.id
            LEFT JOIN LibroCategorias LC ON L.id = LC.libro_id
            LEFT JOIN Categorias C ON LC.categoria_id = C.id
            WHERE L.id = ?
            GROUP BY L.id
        `, [id]);

        if (rows.length === 0) {
            res.status(404).json({ error: `No se encontró un libro con id ${id}` });
            return;
        }

        const libro = {
            id: rows[0].id,
            titulo: rows[0].titulo,
            imagen_url: rows[0].imagen_url,
            editorial: rows[0].editorial,
            ano: rows[0].ano,
            idioma: rows[0].idioma,
            npaginas: rows[0].npaginas,
            isbn13: rows[0].isbn13,
            autores: rows[0].autores ? rows[0].autores.split(', ') : [],
            categorias: rows[0].categorias ? rows[0].categorias.split(', ') : []
        };

        res.json(libro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para obtener los ejemplares disponibles por ID de libro
export const totalEjemplaresDisponiblesPorLibroId = async (req, res) => {
   
    const { id } = req.params;
    console.log('id:', id);

    let conexion;
    try {
        conexion = await crearConexion();
        // Consulta para contar los ejemplares disponibles
        const consulta = `
            SELECT COUNT(*) AS num_ejemplares_disponibles
            FROM Ejemplares
            WHERE libro_id = ? AND estado = 'disponible'
        `;

        const [rows] = await conexion.query(consulta, [id]);

        const numEjemplaresDisponibles = rows.num_ejemplares_disponibles;

        res.json({ numEjemplaresDisponibles });
    } catch (error) {
        res.status(500).json({ error: `Error al obtener ejemplares disponibles para el libro ${id}: ${error.message}` });
    } 
    
};


export const obtenerEjemplarDisponible = async (req, res) => {
    const { id } = req.params;

    try {
        const conexion = await crearConexion();

        // Consulta para obtener el primer ejemplar disponible para un libro específico
        const consulta = `
            SELECT numero_ejemplar
            FROM Ejemplares
            WHERE libro_id = ? AND estado = 'disponible'
            ORDER BY numero_ejemplar ASC
            LIMIT 1
        `;

        const [rows] = await conexion.query(consulta, [id]);

        // if (rows.length === 0) {
        //     res.status(404).json({ error: `No hay ejemplares disponibles para el libro ${id}` });
        //     return;
        // }
        if (rows === undefined) {
            res.status(404).json({ error: `No hay ejemplares disponibles para el libro ${id}` });
            return;
        }

        console.log('rows:', rows);

        const numeroEjemplar = rows.numero_ejemplar;

        res.json({ numeroEjemplar });
    } catch (error) {
        res.status(500).json({ error: `Error al obtener ejemplar disponible para el libro ${id}: ${error.message}` });
    }
};

