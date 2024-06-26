import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchLibroById } from '../../services/librosService';
import { Loader } from '../../ui/components/Loader';
import estilos from './BookPage.module.css';
import { DejarOpinion } from '../components/DejarOpinion';
import { PrestarButton } from '../components/PrestarButton';
import { totalEjemplaresDisponibles } from '../../services/ejemplaresService';
import { MostrarOpiniones } from '../components/MostrarOpiniones';
export const BookPage = () => {
    const { id } = useParams();
    const [libro, setLibro] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalDisponibles, setTotalDisponibles] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const getLibro = async () => {
            try {
                const data = await fetchLibroById(id);
                setLibro(data);
                const disponibles = await totalEjemplaresDisponibles(id);
                console.log('disponibles:', disponibles);
                setTotalDisponibles(disponibles.numEjemplaresDisponibles);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching book details: ', error);
                setIsLoading(false);
            }
        };

        getLibro();
    }, [id]);

    if (isLoading) {
        return <Loader />;
    }

    if (!libro) {
        return <p>Libro no encontrado</p>;
    }

    const volver = () => {
        navigate('/homepage', { replace: true });
    };


    return (
        <>
            <div className={`${estilos.libroContainer} animate__animated animate__fadeIn`}>
                <div className={estilos.imagenContainer}>
                    <img src={libro.imagen_url} alt={libro.titulo} className={`${estilos.imagenLibro} animate__animated animate__slideInLeft`} />
                </div>
                <div className={estilos.detallesLibro}>
                    <h1 className={estilos.tituloLibro}>{libro.titulo}</h1>
                    <h2 className={estilos.autorLibro}>Autor(es): &nbsp;
                        <Link to={`/busqueda?q=${libro.autores}`}> {libro.autores} </Link>
                    </h2>
                    <div className={`${estilos.detallesAdicionales}`}>
                        <p><span className={estilos.etiqueta}>Editorial:</span> {libro.editorial}</p>
                        <p><span className={estilos.etiqueta}>Año:</span> {(libro.ano === 0) ? 'Año no definido' : libro.ano}</p>
                        <p><span className={estilos.etiqueta}>Idioma:</span> {libro.idioma}</p>
                        {libro.npaginas == 0 ? null : <p><span className={estilos.etiqueta}>Páginas:</span> {libro.npaginas}</p>}
                        <p><span className={estilos.etiqueta}>ISBN-13:</span> {libro.isbn13}</p>
                    </div>
                    <div className={estilos.categorias}>
                        <h3>Categorías:</h3>
                        <ul>
                            {libro && libro.categorias && libro.categorias.map((categoria, index) => (
                                <li key={index}>
                                    <Link to={`/busqueda?q=${categoria}`} className={estilos.enlaceCategoria}>
                                        {categoria}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={estilos.contenedorPrestamo}>
                        <PrestarButton libroId={libro.id} />
                        <p className={estilos.totalDisponibles}>Total disponibles: {totalDisponibles}</p>
                    </div>

                </div>
            </div>
            <MostrarOpiniones libroId={libro.id} />
            <DejarOpinion libroId={libro.id} />
        </>
    );
};
