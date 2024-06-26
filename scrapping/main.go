package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gocolly/colly"
)

type Libro struct {
	TituloLibro    string   `json:"TituloLibro"`
	ImagenUrl      string   `json:"ImagenUrl"`
	Formato        string   `json:"Formato"`
	Autor          string   `json:"Autor"`
	Editorial      string   `json:"Editorial"`
	Año            string   `json:"Año"`
	Idioma         string   `json:"Idioma"`
	NPaginas       string   `json:"N° páginas"`
	Encuadernacion string   `json:"Encuadernacion"`
	Dimensiones    string   `json:"Dimensiones"`
	ISBN13         string   `json:"ISBN13"`
	NEdicion       string   `json:"N° edicion"`
	Categorías     []string `json:"Categorías"`
}

func timer(name string) func() {
	start := time.Now()
	return func() {
		fmt.Printf("%s tiempo de ejecución %v\n", name, time.Since(start))
	}
}

func main() {
	defer timer("main")()

	c := colly.NewCollector()

	var libros []Libro

	urls := []string{
		"/libros/arte",
		"/libros/computacion",
		"/libros/filologia",
		"/libros/tierra-medio-ambiente",
		"/libros/derecho",
		"/libros/ciencias-economicas",
		"/libros/aficiones-ocio",
		"/libros/matematicas-ciencias",
		"/libros/ficcion",
		"/libros/lenguaje",
		//"/libros/novela-grafica",
		// "/libross/medicina",
		//"/libros/materia-interdisciplinar",
		//"/libros/deportes-actividades-ocio-aire-libre",
		// "/libros/filosofia-religion",
		// "/libros/historia-arqueologia",
		// "/libros/infantiles-juveniles-didactico",
		// "/libros/salud-relaciones-desarrollo-personal",
		// "/libros/ciencias-sociedad",
		// "/libros/tecnologia-ingenieria-agricultura",
		// "/libros/calificadores-de-periodo-de-tiempo",
		// "/libros/calificadores-de-lengua",
		// "/libros/calificadores-de-lugar",
		// "/libros/calificadores-de-interes",
		// "/libros/calificadores-de-fines-educativos",
		// "/libros/calificadores-de-estilo",
	}

	// Crear un archivo JSON para almacenar los libros
	fileName := "libros.json"
	file, err := os.Create(fileName)
	if err != nil {
		fmt.Println("Error al crear el archivo JSON:", err)
		return
	}
	defer file.Close()

	// Crear un escritor JSON sin escapar los caracteres HTML como "&lt;", "&gt;", "&amp;", etc.
	writer := json.NewEncoder(file)
	writer.SetEscapeHTML(false)

	contador := 0

	// Función para extraer la información de cada resultado y visitar la página del libro
	extraerInfo := func(e *colly.HTMLElement) {

		if contador >= 10 {
			return
		}
		contador++

		// Obtener la URL del libro
		url := e.ChildAttr("a", "href")
		fmt.Println("Visitando la página del libro:", url)

		c.Visit(url)
	}

	// Función para extraer la información de la página del libro
	extraerDetallesLibro := func(e *colly.HTMLElement) {

		// Crear un nuevo libro solo si la página contiene la información de un libro
		if e.DOM.Find(".ficha .row").Length() > 0 {
			i := Libro{
				TituloLibro: e.ChildText(".tituloProducto"),
				ImagenUrl:   e.ChildAttr(".imagen img", "data-src"),
			}
			fmt.Println("URL de la imagen:", i.ImagenUrl)

			// Obtener la información de la ficha del libro y almacenarla en el libro
			e.ForEach(".ficha .row", func(_ int, el *colly.HTMLElement) {
				key := strings.TrimSpace(el.ChildText(".col-xs-5 .box"))
				value := strings.TrimSpace(el.ChildText(".col-xs-7 .box"))

				// Algunos campos tienen enlaces, extraemos solo el texto
				if strings.HasPrefix(value, "http") {
					value = el.ChildText(".col-xs-7 .box a")
				}

				if value == "" {
					value = "No disponible"
				}

				// Asignar el valor al campo correspondiente en el libro
				switch key {
				case "Formato":
					i.Formato = value
				case "Autor":
					i.Autor = value
				case "Editorial":
					i.Editorial = value
				case "Año":
					i.Año = value
				case "Idioma":
					i.Idioma = value
				case "N° páginas":
					i.NPaginas = value
				case "Encuadernacion":
					i.Encuadernacion = value
				case "Dimensiones":
					i.Dimensiones = value
				case "ISBN13":
					i.ISBN13 = value
				case "N° edicion":
					i.NEdicion = value
				case "Categorías":
					// Dividir la cadena de texto en los saltos de línea para crear un slice de categorías
					categorias := strings.Split(value, "\n")

					// Crear un nuevo slice para almacenar las categorías que no están vacías
					categoriasNoVacias := []string{}

					// Recorrer el slice de categorías
					for _, categoria := range categorias {
						// Eliminar los espacios en blanco adicionales de cada categoría
						categoria = strings.TrimSpace(categoria)

						// Añadir la categoría al nuevo slice solo si no está vacía
						if categoria != "" {
							categoriasNoVacias = append(categoriasNoVacias, categoria)
						}
					}

					// Asignar el nuevo slice de categorías al libro
					i.Categorías = categoriasNoVacias

				}
			})
			libros = append(libros, i)

		}
	}

	// Adjuntar la función de extracción de información con los elementos de la lista de libros
	c.OnHTML(".productos.pais46 .box-producto", func(e *colly.HTMLElement) {
		extraerInfo(e)
	})

	// Adjuntar la función de extracción de detalles del libro
	c.OnHTML("body", func(e *colly.HTMLElement) {
		extraerDetallesLibro(e)
	})

	// Visitar cada URL específica
	for _, url := range urls {
		// Reiniciamos el contador para cada enlace
		contador = 0

		enlaceCompleto := "https://www.buscalibre.com.co" + url
		// Visitamos la URL
		c.Visit(enlaceCompleto)
	}

	// Esperar a que se completen todas las solicitudes antes de salir
	c.Wait()

	// Serializar los libros en formato JSON
	data, err := json.MarshalIndent(libros, "", "    ")
	if err != nil {
		fmt.Println("Error al serializar el libro:", err)
		return
	}
	// Escribir el libro en el archivo JSON
	fmt.Printf(string(data))
	if err := writer.Encode(libros); err != nil {
		fmt.Println("Error al escribir el libro en el archivo JSON:", err)
		return
	}
}
