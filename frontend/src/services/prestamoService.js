// src/services/prestamos.services.js
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

export const obtenerPrestamos = async (usuarioId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/usuarios/prestamos/${usuarioId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener losss préstamos del usuario:', error);
        throw error;
    }
};
 
export const devolverPrestamo =  async (prestamoId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/prestamos/devolver/${prestamoId}`);
        return response.data;
    } catch (error) {
        console.error('Error al devolver préstamo:', error);
        throw error;
    }
}