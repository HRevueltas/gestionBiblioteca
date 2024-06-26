package models

import (
	"database/sql"
	"fmt"
	"gestion-biblioteca/database"
	"testing"
)

func TestInsertarLibro(t *testing.T) {
	db, err := database.DBConnection()
	if err != nil {
		t.Fatal("Error conectando a la base de datos:", err)
	}
	defer db.Close()

	// Datos del nuevo libro
	nuevoLibro := Libro{
		Titulo:      "RELATO DE MI VIDA",
		ImagenUrl:   "https://imagessl3.casadellibro.com/a/l/s5/43/9788494454943.webp",
		Formato:     "Libro Físico",
		Autor:       "THOMAS MANN",
		Editorial:   "Hermida Editores S.L",
		Ano:         2023,
		Idioma:      "Español",
		NPaginas:    250,
		Dimensiones: "15 x 20 cm",
		ISBN13:      "9781234567890",
		Categorias:  []string{"Prueba", "Testing"},
	}

	err = InsertarLibro(db, nuevoLibro)
	if err != nil {
		t.Fatal("Error al insertar el libro:", err)
	}

	// Verificar que el libro se insertó correctamente
	// (debes implementar esta lógica)
	// Por ejemplo, puedes buscar el libro por ID o ISBN y verificar sus campos.
}

func InsertarLibro(db *sql.DB, libro Libro) error {
	// 1. Verificar si el autor existe (o insertarlo)
	var autorID int
	err := db.QueryRow("SELECT id FROM Autores WHERE nombre = ?", libro.Autor).Scan(&autorID)
	if err != nil {
		if err == sql.ErrNoRows {
			// El autor no existe, insertarlo
			res, err := db.Exec("INSERT INTO Autores (nombre) VALUES (?)", libro.Autor)
			if err != nil {
				return fmt.Errorf("error al insertar autor: %v", err)
			}
			autorID64, _ := res.LastInsertId()
			autorID = int(autorID64)
		} else {
			return fmt.Errorf("error al buscar autor: %v", err)
		}
	}

	// 2. Insertar el libro
	res, err := db.Exec(`
        INSERT INTO Libros (titulo, imagen_url, formato, id_autor, editorial, ano, idioma, npaginas, dimensiones, isbn13)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, libro.Titulo, libro.ImagenUrl, libro.Formato, autorID, libro.Editorial, libro.Ano, libro.Idioma, libro.NPaginas, libro.Dimensiones, libro.ISBN13)
	if err != nil {
		return fmt.Errorf("error al insertar libro: %v", err)
	}
	libroID64, _ := res.LastInsertId()
	libroID := int(libroID64)

	// 3. Insertar las categorías (si no existen) y las relaciones
	for _, categoria := range libro.Categorias {
		var categoriaID int
		err := db.QueryRow("SELECT id FROM Categorias WHERE nombre = ?", categoria).Scan(&categoriaID)
		if err != nil {
			if err == sql.ErrNoRows {
				// La categoría no existe, insertarla
				res, err := db.Exec("INSERT INTO Categorias (nombre) VALUES (?)", categoria)
				if err != nil {
					return fmt.Errorf("error al insertar categoría: %v", err)
				}
				categoriaID64, _ := res.LastInsertId()
				categoriaID = int(categoriaID64)
			} else {
				return fmt.Errorf("error al buscar categoría: %v", err)
			}
		}

		// Insertar la relación libro-categoría
		_, err = db.Exec("INSERT INTO LibroCategorias (libro_id, categoria_id) VALUES (?, ?)", libroID, categoriaID)
		if err != nil {
			return fmt.Errorf("error al insertar relación libro-categoría: %v", err)
		}
	}

	return nil
}
