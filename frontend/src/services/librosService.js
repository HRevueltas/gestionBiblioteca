import axios from 'axios';
import { API_BASE_URL } from '../api/config';

export const fetchLibros = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/libros`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo los libros: ', error);
        throw error;
    }
};

export const getRandomLibros = (data) => {
    return data.sort(() => Math.random() - 0.5).slice(0, 5);
};

export const fetchLibroById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/libros/${id}`);
        
        return response.data;
    } catch (error) {

        console.error('Error : ', error);
        throw error;
    }
};
