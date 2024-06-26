import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth/auth.store';
import { useBibliotecaStore } from '../../stores/biblioteca/biblioteca.store';
import { devolverPrestamo } from '../../services/prestamoService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './PrestamosPage.module.css';

export const PrestamosPage = () => {
    const { user, status } = useAuthStore();
    const { prestamos, obtenerPrestamosUsuario, errorMessage } = useBibliotecaStore();

    useEffect(() => {
        if (status === 'authenticated' && user.id) {
            obtenerPrestamosUsuario(user.id);
        }
    }, [status, user.id, obtenerPrestamosUsuario]);

    if (status !== 'authenticated') {
        return <div>Por favor, inicie sesión para ver sus préstamos.</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }


    const handleDevolverPrestamo = async (prestamoId) => {
        try {
            const respuesta = await devolverPrestamo(prestamoId);
            toast.success('Préstamo devuelto exitosamente', {
                position: 'top-center',
                autoClose: 3000,
            });
            console.log('Respuesta al devolver préstamo:', respuesta);
            obtenerPrestamosUsuario(user.id); // Refrescar la lista de préstamos después de devolver
        } catch (error) {
            console.error('Error al devolver el préstamo:', error);
        }
    };

    // Función para formatear la fecha de devolución
    const formatDate = (fechaDev) => {
        const fecha = new Date(fechaDev);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return fecha.toLocaleDateString('es-ES', options);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Préstamos</h1>
            {prestamos.length === 0 ? (
                <p className={styles.emptyMessage}>No tiene préstamos actualmente.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestamos.map(prestamo => (
                            <tr key={prestamo.id}>
                                <td>{prestamo.libro_titulo}</td>
                                <td>Vence {formatDate(prestamo.fecha_devolucion)}</td>
                                <td>
                                    <button onClick={() => handleDevolverPrestamo(prestamo.id)} className={styles.actionButton}>DEVOLVER</button>
                                    {/* <button className={styles.actionButton}>LEER</button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

