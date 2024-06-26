import { create } from 'zustand';
import { obtenerPrestamos } from '../../services/prestamoService';
import { persist, devtools } from 'zustand/middleware'
const storeApi = (set) => ({
    prestamos: [
        // {
        //     id_prestamo: null,
        //     usuario_id: null,
        //     libro_id: null,
        //     numero_ejemplar: null,
        //     fecha_prestamo: null,
        //     fecha_devolucion: null,

        // }
    ],
    errorMessage: null,

    // Agregar préstamo
    agregarPrestamo: (prestamo) => set((state) => ({
        prestamos: [...state.prestamos, prestamo],
    }
    ), false, 'agregarPrestamo'
    ),

    // Eliminar préstamo
    eliminarPrestamo: (prestamoId) => set((state) => (
        {
            prestamos: state.prestamos.filter(prestamo => prestamo.id !== prestamoId),
        }
    ), false, 'eliminarPrestamo'
    ),

    // Obtener préstamos de un usuario
    obtenerPrestamosUsuario: async (usuarioId) => {
        try {
            const prestamos = await obtenerPrestamos(usuarioId);
            set({ prestamos });
        } catch (error) {
            console.log('Error al obtener préstamos del usuario:', error);
            set({ errorMessage: 'Error al obtener préstamos del usuario' });
        }
    },
});

export const useBibliotecaStore = create(
    devtools(
        persist(
            storeApi, { name: 'biblioteca-store' })
    )
    // storeApi
);
