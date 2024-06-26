// package models

// import "database/sql"

// type Libro struct {
// 	ID          int      `json:"id"`
// 	Titulo      string   `json:"TituloLibro"`
// 	ImagenUrl   string   `json:"ImagenUrl"`
// 	Formato     string   `json:"Formato"`
// 	Autor       string   `json:"Autor"`
// 	Editorial   string   `json:"Editorial"`
// 	Ano         int      `json:"Año"`
// 	Idioma      string   `json:"Idioma"`
// 	NPaginas    int      `json:"NPaginas"`
// 	Dimensiones string   `json:"Dimensiones"`
// 	ISBN13      string   `json:"ISBN13"`
// 	Categorias  []string `json:"Categorías"`
// }

// func GetLibros(db *sql.DB) ([]Libro, error) {
// 	rows, err := db.Query(`
//         SELECT l.id, l.titulo, l.imagen_url, l.formato, a.nombre, l.editorial, l.ano, l.idioma, l.npaginas, l.dimensiones, l.isbn13
//         FROM Libros l
//         JOIN Autores a ON l.id_autor = a.id
//     `)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var libros []Libro

// 	for rows.Next() {
// 		var libro Libro
// 		err := rows.Scan(&libro.ID, &libro.Titulo, &libro.ImagenUrl, &libro.Formato, &libro.Autor, &libro.Editorial, &libro.Ano, &libro.Idioma, &libro.NPaginas, &libro.Dimensiones, &libro.ISBN13)
// 		if err != nil {
// 			return nil, err
// 		}

// 		categoriaRows, err := db.Query(`
//             SELECT c.nombre
//             FROM Categorias c
//             JOIN LibroCategorias lc ON c.id = lc.categoria_id
//             WHERE lc.libro_id = ?
//         `, libro.ID)
// 		if err != nil {
// 			return nil, err
// 		}
// 		defer categoriaRows.Close()

// 		var categorias []string
// 		for categoriaRows.Next() {
// 			var categoria string
// 			err := categoriaRows.Scan(&categoria)
// 			if err != nil {
// 				return nil, err
// 			}
// 			categorias = append(categorias, categoria)
// 		}

// 		libro.Categorias = categorias
// 		libros = append(libros, libro)
// 	}
// 	return libros, nil
// }

// func GetLibroByID(db *sql.DB, id int) (Libro, error) {
// 	var libro Libro

// 	query := `SELECT l.id, l.titulo, l.imagen_url, l.formato, a.nombre as autor, l.editorial, l.ano, l.idioma, l.npaginas, l.dimensiones, l.isbn13
//               FROM Libros l
//               JOIN Autores a ON l.id_autor = a.id
//               WHERE l.id = ?`

// 	row := db.QueryRow(query, id)
// 	err := row.Scan(&libro.ID, &libro.Titulo, &libro.ImagenUrl, &libro.Formato, &libro.Autor, &libro.Editorial, &libro.Ano, &libro.Idioma, &libro.NPaginas, &libro.Dimensiones, &libro.ISBN13)
// 	if err != nil {
// 		return libro, err
// 	}

// 	categoriesQuery := `SELECT c.nombre
//                         FROM Categorias c
//                         JOIN LibroCategorias lc ON c.id = lc.categoria_id
//                         WHERE lc.libro_id = ?`

// 	rows, err := db.Query(categoriesQuery, libro.ID)
// 	if err != nil {
// 		return libro, err
// 	}
// 	defer rows.Close()

// 	for rows.Next() {
// 		var categoria string
// 		if err := rows.Scan(&categoria); err != nil {
// 			return libro, err
// 		}
// 		libro.Categorias = append(libro.Categorias, categoria)
// 	}

// 	return libro, nil
// }


