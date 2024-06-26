import axios from 'axios';
import {API_BASE_URL} from './config';
export const realizarPrestamo = async (prestamoData) => {
    const response = await axios.post(`${API_BASE_URL}/usuarios/prestamo`, prestamoData);
    return response.data;
};