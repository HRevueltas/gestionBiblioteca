import React, { useEffect, useState } from 'react';
import estilos from './BusquedaPage.module.css';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { fetchLibros } from '../../services/librosService';


export const BusquedaPage = () => { 
    const location = useLocation();
    const { q } = queryString.parse(location.search);
    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        const searchLibros = async () => {
            try {
                const libros = await fetchLibros();
                const filteredLibros = libros.filter(
                    (libro) =>
                        libro.titulo.toLowerCase().includes(q.toLowerCase()) ||
                        libro.autores.some((autores) => autores.toLowerCase().includes(q.toLowerCase())) ||
                        libro.categorias.some((categoria) => categoria.toLowerCase().includes(q.toLowerCase()))
                );
                setResultados(filteredLibros);
            } catch (error) {
                console.error('Error searching libros: ', error);
            }
        };

        searchLibros();
    }, [q]); // Ejecuta la búsqueda cuando el parámetro de la consulta de búsqueda cambie

    const handlePrestar = (libro) => {
        console.log('Prestar libro: ', libro);
    }
    return (
        <div className={estilos.contenedorPrincipal}> 
        {(resultados.length === 0) ?
            <p className={estilos.mensajeNoResultados}>No se encontraron resultados para {q}</p>
            : <h1 className={estilos.tituloResultados}>Resultados de búsqueda para "{q}"</h1>
        }

        <ul className={estilos.listaResultados}>
            {resultados.map((libro) => (
                <div className={`${estilos.contenedorLibro} animate__animated animate__fadeInUp  animate__faster
                
                ` } key={libro.id}>
                    <Link to={`/libro/${libro.id}`} className={estilos.enlaceLibro}>
                        <img src={libro.imagen_url} alt={libro.titulo} className={estilos.imagenLibro} />
                        <h1 className={estilos.tituloLibro}>{libro.titulo}</h1>
                        <h2 className={estilos.autorLibro}>{libro.autores}</h2>
                        
                         <div>
                        
                         </div>
                    </Link>
                    
                </div>
            ))}
        </ul>
    </div>
    );
};
