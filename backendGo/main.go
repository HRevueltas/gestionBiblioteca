package main

import (
	"encoding/json"
	"gestion-biblioteca/database"
	"gestion-biblioteca/models"
	"io/ioutil"
	"log"
	"os"
)

func main() {

	db, err := database.DBConnection()
	if err != nil {
		panic(err)
	}
	defer database.Close(db)

	libros, err := leerJSON("data/librosCopy.json")
	if err != nil {
		log.Fatal(err)
	}

	err = models.InsertarLibros(db, libros)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Datos insertados exitosamente")

}

func leerJSON(filename string) ([]models.Libro, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	var libros []models.Libro
	err = json.Unmarshal(byteValue, &libros)
	if err != nil {
		return nil, err
	}

	return libros, nil
}
