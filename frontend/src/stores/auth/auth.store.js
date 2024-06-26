import { create } from 'zustand';

import { persist , devtools } from 'zustand/middleware'


// Define el store de autenticación
const storeApi = (set) => ({
    status: 'checking', // 'checking', 'not-authenticated', 'authenticated'
    user: {
        id: null,
        nombre: null,
        apellidos: null,
        email: null,
    },
    errorMessage: null,
    // Define la acción para iniciar sesión
    login: (usuario) => set((state) => (
        {
            status: 'authenticated',
            user: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                email: usuario.email,
            },
            errorMessage: null,
        }
    ), false, 'login'
),
    // Define la acción para cerrar sesión
    logout: () => set((state) => ({
        status: 'not-authenticated',
        user: {
            id: null,
            nombre: null,
            apellidos: null,
            email: null,
        },
        errorMessage: null,
    }),false , 'logout'),

    checkingCredentials: () => set((state) => ({
        status: 'checking',
    }), false, 'checkingCredentials'),
})






// Crea un store para manejar el estado de autenticación
export const useAuthStore = create(
    devtools(
        persist(
            storeApi, { name: 'auth-store' })
    )
);


