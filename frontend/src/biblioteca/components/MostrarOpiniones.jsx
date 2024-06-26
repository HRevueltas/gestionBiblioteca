import React, { useEffect, useState } from 'react';
import { obtenerOpinion } from '../../services/opinionServices';
import styles from './MostrarOpiniones.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const MostrarOpiniones = ({ libroId }) => {
    const [opiniones, setOpiniones] = useState([]);

    useEffect(() => {
        const fetchOpiniones = async () => {
            try {
                const response = await obtenerOpinion(libroId);
                console.log('response:', response);
                setOpiniones(response);
            } catch (error) {
                const errorMessage = error.response.data.error;
                toast.error(errorMessage, {
                    position: 'top-center',
                    autoClose: 3000,
                });
            } 
        };

        fetchOpiniones();
    }, [libroId]);

    if (opiniones.length === 0) {
        return <p>No hay opiniones para este libro.</p>;
    }

    return (
        <div className={styles.opinionesContainer}>
            <h3>Opiniones</h3>
            <ul className={styles.opinionesList}>
                {opiniones.map((opinion) => (
                    <li key={opinion.id} className={styles.opinionItem}>
                        <div className={styles.usuario}>{opinion.nombreUsuario}</div>
                        <p>{opinion.opinion}</p>
                        <div className={styles.fecha}>{new Date(opinion.fecha_opinion).toLocaleDateString()}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
