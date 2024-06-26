import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import estilos from './Categorias.module.css';
import { fetchLibros } from '../../services/librosService';
import { Loader } from '../../ui/components/Loader';

export const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriasAgrupadas, setCategoriasAgrupadas] = useState({});

    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const libros = await fetchLibros();
                const categoriasUnicas = Array.from(new Set(libros.flatMap(libro => libro.Categorías)));
                setCategorias(categoriasUnicas);
                setIsLoading(false);

                // Agrupación automática de categorías
                const nuevasCategoriasAgrupadas = {};
                categoriasUnicas.forEach(categoria => {
                    const palabrasClave = {
                        'Ficción': ['ficción', 'novela', 'cuento', 'misterio', 'thriller', 'terror', 'romance', 'aventura'],
                        'No Ficción': ['historia', 'biografía', 'ciencia', 'tecnología', 'filosofía', 'psicología', 'autoayuda'],
                        'Arte y Diseño': ['arte', 'música', 'cine', 'fotografía', 'diseño', 'arquitectura'],
                        // Agrega más palabras clave según tus necesidades
                    };

                    for (const [categoriaPrincipal, palabras] of Object.entries(palabrasClave)) {
                        if (palabras.some(palabra => categoria.toLowerCase().includes(palabra))) {
                            if (!nuevasCategoriasAgrupadas[categoriaPrincipal]) {
                                nuevasCategoriasAgrupadas[categoriaPrincipal] = [];
                            }
                            nuevasCategoriasAgrupadas[categoriaPrincipal].push(categoria);
                            break; // Evita que una categoría se agregue a múltiples grupos
                        }
                    }

                    // Si no se encuentra ninguna palabra clave, agregar a "Otras"
                    if (!Object.values(nuevasCategoriasAgrupadas).flat().includes(categoria)) {
                        if (!nuevasCategoriasAgrupadas['Otras']) {
                            nuevasCategoriasAgrupadas['Otras'] = [];
                        }
                        nuevasCategoriasAgrupadas['Otras'].push(categoria);
                    }
                });

                setCategoriasAgrupadas(nuevasCategoriasAgrupadas);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
                setIsLoading(false);
            }
        };

        obtenerCategorias();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={estilos.contenedorCategorias}>
            <h1 className={estilos.tituloCategorias}>Explora por Categoría</h1>

            <div className={estilos.gridCategorias}>
                {Object.entries(categoriasAgrupadas).map(([categoriaPrincipal, subcategorias]) => (
                    <div key={categoriaPrincipal} className={estilos.tarjetaCategoria}>
                        <h2 className={estilos.tituloGrupo}>{categoriaPrincipal}</h2>
                        <ul className={estilos.listaSubcategorias}>
                            {subcategorias.map((subcategoria) => (
                                <li key={subcategoria}>
                                    <Link to={`/busqueda?q=${subcategoria}`} className={estilos.enlaceSubcategoria}>
                                        {subcategoria}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
