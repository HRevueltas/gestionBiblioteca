import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import estilos from './NavBar.module.css';
import { useForm } from '../../hooks/useForm';
import { fetchLibros } from '../../services/librosService';
import { CategoriasDropdown } from '../../biblioteca/components/CategoriasDropdown';
import { useAuthStore } from '../../stores/auth/auth.store';

export const NavBar = () => {
    // Estado para el texto de búsqueda y funciones del hook useForm
    const { searchText, onInputChange, onResetForm } = useForm({
        searchText: '',
    });
    // Estado para controlar la visibilidad de la barra al hacer scroll
    const [isScrolling, setIsScrolling] = useState(false);
    const [prevScrollY, setPrevScrollY] = useState(0);
    const [eventType, setEventType] = useState('')
    // Estado para controlar la categoría activa y mostrar el menú desplegable
    const [activeCategory, setActiveCategory] = useState(null);
    const [categoriasAgrupadas, setCategoriasAgrupadas] = useState({});

    const user = useAuthStore(state => state.user);
    const status = useAuthStore(state => state.status);
    const logout = useAuthStore(state => state.logout);

    const onLogout = () => {
        logout();
    };


    // useEffect para obtener las categorías al montar el componente
    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const libros = await fetchLibros();
                const categoriasUnicas = Array.from(new Set(libros.flatMap(libro => libro.categorias)));

                // Agrupación automática de categorías (puedes ajustar las palabras clave)
                const nuevasCategoriasAgrupadas = {};
                categoriasUnicas.forEach(categoria => {
                    const palabrasClave = {
                        'Ficción': ['ficción', 'novela', 'cuento', 'misterio', 'thriller', 'terror', 'romance', 'aventura'],
                        'No Ficción': ['historia', 'biografía', 'ciencia', 'tecnología', 'filosofía', 'psicología', 'autoayuda'],
                        'Arte y Diseño': ['arte', 'música', 'cine', 'fotografía', 'diseño', 'arquitectura'],
                        // ... (más palabras clave según tus necesidades)
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
            }
        };

        obtenerCategorias();
    }, []);

    // useEffect para controlar la visibilidad de la barra al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (prevScrollY < currentScrollY && currentScrollY > 0) {
                setIsScrolling(true);
            } else {
                setIsScrolling(false);
            }
            setPrevScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollY]);

    // Función para manejar el envío del formulario de búsqueda
    const navigate = useNavigate();
    const onHandleSubmit = (e) => {
        e.preventDefault();
        if (searchText.trim().length === 0) return;
        navigate(`/busqueda?q=${searchText}`);
    };

    const handleMouseEnter = (categoria) => {
        setActiveCategory(categoria)
        setEventType('mouseenter')
    }

    const handleMouseLeave = () => {
        setActiveCategory(null)
        setEventType('mouseleave')
    }

    const handleCategoryClick = () => {
        setActiveCategory(null)
        setEventType('click')
    }


    // Renderizado del componente NavBar
    return (
        <nav className={`${estilos.navbar} ${isScrolling ? estilos.navbarHidden : ''}`}>
            <div className={estilos.navbarTop}>
                <Link to="/inicio">
                    <div className={estilos.logo}>Librería</div>
                </Link>
                <div className={estilos.searchContainer}>
                    <form onSubmit={onHandleSubmit} className={estilos.searchForm}>
                        <input
                            type="text"
                            placeholder="Buscar libros por autor o título"
                            name='searchText'
                            value={searchText}
                            onChange={onInputChange}
                            className={estilos.searchInput}
                        />
                        <button className={estilos.searchButton}>Buscar</button>
                    </form>
                </div>
                <div className={estilos.account}>
                    {status === 'authenticated' ? (
                        <div className={estilos.dropdown}>
                            <button className={estilos.dropbtn}>{user.nombre}</button>
                            <div className={estilos.dropdownContent}>
                                <Link to="/prestamos">Préstamos</Link>
                                <Link onClick={
                                    onLogout
                                }  to="/inicio">Cerrar Sesión</Link>
                            </div>
                        </div>
                    ) : (
                        <div className={estilos.dropdown}>
                            <button className={estilos.dropbtn}>cuenta</button>
                            <div className={estilos.dropdownContent}>
                                <Link to="/auth/login">Iniciar Sesión</Link>
                                <Link to="/auth/registro">Registrarse</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={estilos.navbarBottom}>
                {Object.keys(categoriasAgrupadas).map((categoria) => (
                    <Link
                        key={categoria}
                        to={`/busqueda?q=${categoria}`}
                        className={estilos.categoryLink}
                        onMouseEnter={() => handleMouseEnter(categoria)}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleCategoryClick}
                    >
                        {categoria}
                        {activeCategory === categoria && <CategoriasDropdown categoria={categoria} categoriasAgrupadas={categoriasAgrupadas}
                            eventType={eventType}
                        />}
                    </Link>
                ))}
            </div>
        </nav>
    );
};
