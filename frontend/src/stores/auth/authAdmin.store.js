import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Define el store de autenticación de admin
const storeApi = (set) => ({
    status: 'checking', // 'checking', 'not-authenticated', 'authenticated'
    admin: {
        usuario: null,
        password: null,
    },
    errorMessage: null,
    // Define la acción para iniciar sesión
    login: (admin) => set((state) => (
        {
            status: 'authenticated',
            admin: {
                usuario: admin.usuario,
                password: admin.password,
            },
            errorMessage: null,
        }
    ), false, 'login'),
    // Define la acción para cerrar sesión
    logout: () => set((state) => ({
        status: 'not-authenticated',
        admin: {
            usuario: null,
            password: null,
        },
        errorMessage: null,
    }), false, 'logout'),

    checkingCredentials: () => set((state) => ({
        status: 'checking',
    }), false, 'checkingCredentials'),
});

// Crea un store para manejar el estado de autenticación del admin
export const useAuthAdminStore = create(
    devtools(
        persist(
            storeApi, { name: 'auth-admin-store' }
        )
    )
);
