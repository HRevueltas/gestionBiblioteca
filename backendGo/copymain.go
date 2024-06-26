// package main

// import (
// 	"database/sql"
// 	"encoding/json"
// 	"fmt"
// 	"gestion-biblioteca/database"
// 	"gestion-biblioteca/models"
// 	"log"
// 	"net/http"
// 	"strconv"

// 	"github.com/gorilla/mux"
// )

// // Middleware para manejar CORS
// func enableCORS(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		w.Header().Set("Access-Control-Allow-Origin", "*")
// 		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
// 		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
// 		if r.Method == http.MethodOptions {
// 			w.WriteHeader(http.StatusOK)
// 			return
// 		}
// 		next.ServeHTTP(w, r)
// 	})
// }

// func librosHandler(db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		if r.Method == http.MethodGet {
// 			libros, err := models.GetLibros(db)
// 			if err != nil {
// 				http.Error(w, err.Error(), http.StatusInternalServerError)
// 				return
// 			}
// 			w.Header().Set("Content-Type", "application/json")
// 			json.NewEncoder(w).Encode(libros)
// 		} else {
// 			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
// 		}
// 	}
// }

// func libroHandler(db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		vars := mux.Vars(r)
// 		id := vars["id"]

// 		libroID, err := strconv.Atoi(id)
// 		if err != nil {
// 			http.Error(w, "ID de libro inválido", http.StatusBadRequest)
// 			return
// 		}

// 		libro, err := models.GetLibroByID(db, libroID)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		w.Header().Set("Content-Type", "application/json")
// 		json.NewEncoder(w).Encode(libro)
// 	}
// }

// func main() {
// 	db, err := database.DBConnection()
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer database.Close(db)

// 	router := mux.NewRouter()

// 	// Ruta para obtener todos los libros
// 	router.HandleFunc("/api/libros", librosHandler(db)).Methods(http.MethodGet)

// 	// Ruta para obtener un libro por ID
// 	router.HandleFunc("/api/libros/{id}", libroHandler(db)).Methods(http.MethodGet)

// 	// Aplicar el middleware de CORS a todas las rutas
// 	handler := enableCORS(router)

// 	fmt.Println("Servidor escuchando en http://localhost:8080!!")
// 	log.Fatal(http.ListenAndServe(":8080", handler))
// }
