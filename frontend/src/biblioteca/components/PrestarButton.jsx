import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/auth/auth.store';
import { realizarPrestamo } from '../../api/biblioteca';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { obtenerEjemplarDisponible } from '../../services/ejemplaresService';
import styles from './PrestarButton.module.css';
export const PrestarButton = ({ libroId }) => {
    const [numeroEjemplar, setNumeroEjemplar] = useState(null);
    const { user, status } = useAuthStore((state) => ({
        user: state.user,
        status: state.status,
    }));

    useEffect(() => {
        const obtenerNumeroEjemplar = async () => {
            try {
                const data = await obtenerEjemplarDisponible(libroId);
                console.log('data:', data);
                setNumeroEjemplar(data.numeroEjemplar);
            } catch (error) {

                if (error.response && error.response.data && error.response.data.error) {
                    // toast.error(error.response.data.error, {
                        // position: 'bottom-right',
                    // });
                    console.error('Error al obtener el número de ejemplar:', error);
                }
            }
        };

        if (status === 'authenticated') {
            obtenerNumeroEjemplar();
        }
    }, [libroId, status]);

    const handlePrestar = async () => {
        if (status !== 'authenticated') {
            toast.error('Por favor, inicie sesión para realizar un préstamo.', {
                position: 'top-center',
                autoClose: 3000,
                draggable: true,
                
            });
            return;
        }
    
        // if (!numeroEjemplar) {
        //     toast.error('No hay ejemplares disponibles para este libro.', {
        //         position: 'bottom-right',
        //     });
        //     return;
        // }
    
        try {
            const fechaPrestamo = new Date().toISOString().split('T')[0]; // Fecha actual
            console.log('Fecha de préstamo:', fechaPrestamo);
            const fechaDevolucion = new Date();
            fechaDevolucion.setDate(fechaDevolucion.getDate() + 21); // 21 días después
            const fechaDevolucionStr = fechaDevolucion.toISOString().split('T')[0];
    
            const prestamoData = {
                usuario_id: user.id,
                libro_id: libroId,
                numero_ejemplar: numeroEjemplar,
                fecha_prestamo: fechaPrestamo,
                fecha_devolucion: fechaDevolucionStr,
            };
    
            console.log('Datos de préstamo:', prestamoData); // Asegúrate de que los datos de préstamo sean correctos
    
            const response = await realizarPrestamo(prestamoData);
            console.log('Respuesta del préstamo:', response); // Verifica la respuesta del servidor
    

         
                // Aquí manejas el éxito del préstamo
                toast.success('Préstamo registrado exitosamente', {
                    position: 'bottom-right',
                });

            
        } catch (error) {
            console.error('Error al realizar el préstamo:', error);
            const errorMessage = error.response?.data?.error || 'Error al realizar el préstamo';
            toast.info(errorMessage, {
                position: 'bottom-right',
            });
        }
    };
    
    return (
        <button className={styles.prestarButton} onClick={handlePrestar}>Prestar</button>
    );
};
