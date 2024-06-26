package models

import "database/sql"

type Libro struct {
	Titulo         string   `json:"TituloLibro"`
	ImagenUrl      string   `json:"ImagenUrl"`
	Formato        string   `json:"Formato"`
	Autor          string   `json:"Autor"`
	Editorial      string   `json:"Editorial"`
	Ano            string   `json:"Año"`
	Idioma         string   `json:"Idioma"`
	NPaginas       string   `json:"NPaginas"`
	Encuadernacion string   `json:"Encuadernacion"`
	Dimensiones    string   `json:"Dimensiones"`
	ISBN13         string   `json:"ISBN13"`
	NEdicion       string   `json:"NEdicion"`
	Categorias     []string `json:"Categorías"`
}

func InsertarLibros(db *sql.DB, libros []Libro) error {
	for _, libro := range libros {
		// Insertar autor o obtener su ID si ya existe
		var autorID int64
		err := db.QueryRow("SELECT id FROM Autores WHERE nombre = ?", libro.Autor).Scan(&autorID)
		if err != nil {
			if err != sql.ErrNoRows {
				return err
			}
			result, err := db.Exec("INSERT INTO Autores (nombre) VALUES (?)", libro.Autor)
			if err != nil {
				return err
			}
			autorID, err = result.LastInsertId()
			if err != nil {
				return err
			}
		}

		// Insertar categorías y obtener sus IDs
		var categoriaIDs []int64
		for _, categoria := range libro.Categorias {
			var categoriaID int64
			err := db.QueryRow("SELECT id FROM Categorias WHERE nombre = ?", categoria).Scan(&categoriaID)
			if err != nil {
				if err != sql.ErrNoRows {
					return err
				}
				result, err := db.Exec("INSERT INTO Categorias (nombre) VALUES (?)", categoria)
				if err != nil {
					return err
				}
				categoriaID, err = result.LastInsertId()
				if err != nil {
					return err
				}
			}
			categoriaIDs = append(categoriaIDs, categoriaID)
		}

		// Insertar libro
		var libroID int64
		result, err := db.Exec("INSERT INTO Libros (titulo, imagen_url, formato, id_autor, editorial, ano, idioma, npaginas, encuadernacion, dimensiones, isbn13, nedicion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			libro.Titulo, libro.ImagenUrl, libro.Formato, autorID, libro.Editorial, libro.Ano, libro.Idioma, libro.NPaginas, libro.Encuadernacion, libro.Dimensiones, libro.ISBN13, libro.NEdicion)
		if err != nil {
			return err
		}
		libroID, err = result.LastInsertId()
		if err != nil {
			return err
		}

		// Relacionar el libro con las categorías
		for _, categoriaID := range categoriaIDs {
			_, err = db.Exec("INSERT INTO LibroCategorias (libro_id, categoria_id) VALUES (?, ?)", libroID, categoriaID)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
