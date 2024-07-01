// src/admin/components/AdminNavBar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './AdminNavBar.module.css';
import { useAuthAdminStore } from '../../stores/auth/authAdmin.store';

export const AdminNavBar = () => {
    const navigate = useNavigate();
    const { logout } = useAuthAdminStore();

    const handleLogout = () => {
        logout(); // Llama a la acción de logout del store
        navigate('/admin/login'); // Redirige al usuario a la página de login del administrador después de cerrar sesión
    };

    return (
        <nav className={styles.sidebar}>
            <ul>
                <li>
                    <NavLink to="/admin/dashboard" activeClassName={styles.active}>
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Libros</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul>
                                <li>
                                    <NavLink to="/admin/libros" activeClassName={styles.active}>
                                        Lista de Libros
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/autores" activeClassName={styles.active}>
                                        Autores
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/categorias" activeClassName={styles.active}>
                                        Categorías
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                </li>
                <li>
                    <NavLink to="/admin/prestamos" activeClassName={styles.active}>
                        Préstamos
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/usuarios" activeClassName={styles.active}>
                        Usuarios
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/opiniones" activeClassName={styles.active}>
                        Opiniones
                    </NavLink>
                </li>
                <li>
                    <Button onClick={handleLogout} className={styles.logoutButton}>
                        Cerrar sesión
                    </Button>
                </li>
            </ul>
        </nav>
    );
};
