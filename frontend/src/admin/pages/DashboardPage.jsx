// src/admin/pages/DashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Card} from '../components/Card';
import { FaBook, FaUser, FaClipboardList, FaComments } from 'react-icons/fa';
import styles from './DashboardPage.module.css';
import { useAuthAdminStore } from '../../stores/auth/authAdmin.store';

export const DashboardPage = () => {
    const navigate = useNavigate();

    const admin = useAuthAdminStore(state => state.admin);
console.log(admin);
    const cards = [
        {
            title: 'Libros',
            count: 120, // Ejemplo de conteo, puedes reemplazarlo con datos reales
            icon: <FaBook />,
            navigateTo: '/admin/libros',
        },
        {
            title: 'Usuarios',
            count: 45,
            icon: <FaUser />,
            navigateTo: '/admin/usuarios',
        },
        {
            title: 'Préstamos',
            count: 32,
            icon: <FaClipboardList />,
            navigateTo: '/admin/prestamos',
        },
        {
            title: 'Opiniones',
            count: 67,
            icon: <FaComments />,
            navigateTo: '/admin/opiniones',
        },
    ];

    return (
        <div className={styles.dashboard}>
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {admin.usuario}</p>
            <div className={styles.cardsContainer}>
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        title={card.title} 
                        count={card.count}
                        icon={card.icon}
                        onClick={() => navigate(card.navigateTo)}
                    />
                ))}
            </div>
        </div>
    );
};

