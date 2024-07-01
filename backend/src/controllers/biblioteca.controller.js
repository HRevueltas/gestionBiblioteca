import { crearConexion } from "../database/database";

export const obtenerLibros = async (req, res) => {
    let conexion;

    try {
        conexion = await crearConexion();
        /**
         * La consulta realiza una selección de varias columnas de las tablas "Libros", "LibroAutores", "Autores", "LibroCategorias" y "Categorias".
         * Utiliza la cláusula LEFT JOIN para combinar las tablas y obtener información relacionada.
         * La cláusula GROUP BY se utiliza para agrupar los resultados por el identificador del libro (L.id).
         * Esto nos asegura que obtendremos solo una fila de resultados para cada libro.
         * La función GROUP_CONCAT se utiliza para concatenar los nombres de los autores y las categorías en una sola cadena separada por comas.
         * Esto nos permite obtener una lista de todos los autores y categorías relacionados con el libro.
         * 
         * DISTINCT se utiliza para eliminar duplicados en la lista de autores y categorías.
         */
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

        /**El código actual realiza una consulta a una base de datos para obtener información sobre un libro específico. La consulta utiliza varias tablas y realiza un JOIN para obtener información adicional relacionada con el libro.

        Aquí está el significado de las diferentes partes del código:
        
        La consulta comienza con la palabra clave SELECT, que indica que queremos seleccionar ciertas columnas de la base de datos.
        Luego, se enumeran las columnas que queremos seleccionar: L.id, L.titulo, L.imagen_url, L.editorial, L.ano, L.idioma, L.npaginas, L.isbn13. Estas columnas representan diferentes atributos del libro.
        Después de las columnas, utilizamos la función GROUP_CONCAT para concatenar los nombres de los autores y las categorías en una sola cadena separada por comas. Esto nos permite obtener una lista de todos los autores y categorías relacionados con el libro.
        A continuación, especificamos las tablas y las condiciones de unión utilizando la cláusula LEFT JOIN. Esto nos permite combinar la tabla principal "Libros" con las tablas "LibroAutores", "Autores", "LibroCategorias" y "Categorias" para obtener la información relacionada.
        La cláusula WHERE se utiliza para filtrar los resultados y especificar que solo queremos obtener información sobre un libro específico. El valor del parámetro id se utiliza para comparar con la columna L.id.
        Finalmente, utilizamos la cláusula GROUP BY para agrupar los resultados por el identificador del libro (L.id). Esto nos asegura que obtendremos solo una fila de resultados para cada libro.
        En resumen, este código realiza una consulta a la base de datos para obtener información detallada sobre un libro, incluyendo sus atributos, autores y categorías relacionadas.
        */
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
        /*
        La consulta utiliza la cláusula SELECT para especificar qué columna o columnas se deben seleccionar de la tabla Ejemplares. En este caso, solo se selecciona la columna numero_ejemplar.

        La cláusula FROM especifica la tabla de la cual se deben seleccionar los datos. En este caso, se selecciona de la tabla Ejemplares.

        La cláusula WHERE se utiliza para filtrar los resultados según una condición. En este caso, se filtran los ejemplares que tienen un libro_id específico y un estado de "disponible".

        La cláusula ORDER BY se utiliza para ordenar los resultados según una columna específica. En este caso, los resultados se ordenan en orden ascendente según la columna numero_ejemplar.

        La cláusula LIMIT se utiliza para limitar el número de filas devueltas por la consulta. En este caso, se limita a solo una fila, lo que significa que se seleccionará el primer ejemplar disponible.

        Esta consulta se puede utilizar en un sistema de biblioteca para encontrar el primer ejemplar disponible de un libro específico.
        */
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

