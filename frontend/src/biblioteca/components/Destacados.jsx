import { useEffect, useState } from 'react';
import estilos from './Destacados.module.css';
import { fetchLibros, getRandomLibros } from '../../services/librosService';
import { Loader } from '../../ui/components/Loader';
import { useNavigate } from 'react-router';
import { useLocalStorage } from '../hooks/useLocalStorage';
 
export const Destacados = () => { 
    const [libros, setLibros] = useState([]);
    const [libroRandom, setLibroRandom] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [localBooks, setLocalBooks] = useLocalStorage("randomBooks", ""); // Almacenamiento local de los libros al azar
    const navigate = useNavigate();

    useEffect(() => {
        const getLibros = async () => {
            try {
                let randomLibros;
                // Limpiar el almacenamiento local al montar el componente
                setLocalBooks("");
                // Si ya hay libros almacenados localmente, los utilizamos
                if (localBooks) {
                    randomLibros = localBooks;
                } else {
                    const data = await fetchLibros();
                    setLibros(data);
                    randomLibros = getRandomLibros(data);
                    setLocalBooks(randomLibros); // Almacenamos los libros al azar localmente
                }

                setLibroRandom(randomLibros);
                setIsLoading(false);

            } catch (error) {
                console.error('Error fetching data: ', error);
                setIsLoading(false);
            }
        };

        getLibros();
    }, []);

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    if (isLoading) {
        return <Loader />;
    }

    const handleClickBook = (id) => {
        navigate(`/libro/${id}`);
    }

    return (
        <div className={estilos.contenedorSlider}>
            <div className={estilos.slider}>
                {libroRandom.map((libro) => (
                    <div
                        key={libro.id}
                        className={estilos.card}
                        onClick={() => handleClickBook(libro.id)}>
                        <img
                            src={libro.imagen_url}
                            alt={libro.titulo}
                            className={estilos.imagen} />
                        <h3
                            title={libro.titulo}
                            className={estilos.titulo}>
                            {truncateText(libro.titulo, 20)}
                        </h3>
                        <p
                            className={estilos.autor}>{libro.autor}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
