
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

export const totalEjemplaresDisponibles =async(id)=>{
    try {
        const response = await axios.get(`${API_BASE_URL}/libros/${id}/ejemplar`);
        
        return response.data;
    } catch (error) {

        console.error('Error: ', error);
        throw error;
    }
}

export const obtenerEjemplarDisponible = async(id)=>{
    try {
        const response = await axios.get(`${API_BASE_URL}/libros/ejemplar/${id}`);
        
        return response.data;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}