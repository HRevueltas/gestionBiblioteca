package models

import (
	"database/sql"
)

// Estructura para representar un libro en el JSON
type Libro struct {
	Titulo       string   `json:"TituloLibro"`
	ImagenUrl    string   `json:"ImagenUrl"`
	Autor        []string `json:"Autor"`
	Nacionalidad string   `json:"Nacionalidad"`
	Editorial    string   `json:"Editorial"`
	Ano          string   `json:"Año"`
	Idioma       string   `json:"Idioma"`
	NPaginas     string   `json:"NPaginas"`
	ISBN13       string   `json:"ISBN13"`
	Categorias   []string `json:"Categorías"`
}

// Función para insertar libros en la base de datos
func InsertarLibros(db *sql.DB, libros []Libro) error {
	for _, libro := range libros {
		// 1. Insertar o buscar los autores y obtener sus IDs
		var autorIDs []int64
		for _, autorNombre := range libro.Autor {
			var autorID int64
			err := db.QueryRow("SELECT id FROM Autores WHERE nombre = ?", autorNombre).Scan(&autorID)
			if err != nil {
				if err == sql.ErrNoRows {
					result, err := db.Exec("INSERT INTO Autores (nombre, nacionalidad) VALUES (?, ?)", autorNombre, libro.Nacionalidad)
					if err != nil {
						return err
					}
					autorID, err = result.LastInsertId()
					if err != nil {
						return err
					}
				} else {
					return err
				}
			}
			autorIDs = append(autorIDs, autorID)
		}

		// 2. Insertar o buscar las categorías y obtener sus IDs
		var categoriaIDs []int64
		for _, categoria := range libro.Categorias {
			var categoriaID int64
			err := db.QueryRow("SELECT id FROM Categorias WHERE nombre = ?", categoria).Scan(&categoriaID)
			if err != nil {
				if err == sql.ErrNoRows {
					result, err := db.Exec("INSERT INTO Categorias (nombre) VALUES (?)", categoria)
					if err != nil {
						return err
					}
					categoriaID, err = result.LastInsertId()
					if err != nil {
						return err
					}
				} else {
					return err
				}
			}
			categoriaIDs = append(categoriaIDs, categoriaID)
		}

		// 3. Insertar el libro (sin id_autor)
		result, err := db.Exec("INSERT INTO Libros (titulo, imagen_url, editorial, ano, idioma, npaginas, isbn13) VALUES (?, ?, ?, ?, ?, ?, ?)",
			libro.Titulo, libro.ImagenUrl, libro.Editorial, libro.Ano, libro.Idioma, libro.NPaginas, libro.ISBN13)
		if err != nil {
			return err
		}
		libroID, err := result.LastInsertId()
		if err != nil {
			return err
		}

		// 4. Relacionar el libro con los autores (usando LibroAutores)
		for _, autorID := range autorIDs {
			_, err = db.Exec("INSERT INTO LibroAutores (libro_id, autor_id) VALUES (?, ?)", libroID, autorID)
			if err != nil {
				return err
			}
		}

		// 5. Insertar ejemplares (asumiendo que siempre hay al menos un ejemplar disponible)
		_, err = db.Exec("INSERT INTO Ejemplares (libro_id, numero_ejemplar, estado) VALUES (?, 1, 'disponible')", libroID)
		if err != nil {
			return err
		}

		// 6. Relacionar el libro con las categorías
		for _, categoriaID := range categoriaIDs {
			_, err = db.Exec("INSERT INTO LibroCategorias (libro_id, categoria_id) VALUES (?, ?)", libroID, categoriaID)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
