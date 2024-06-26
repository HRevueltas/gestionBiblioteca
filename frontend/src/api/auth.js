import axios from 'axios';
import { API_BASE_URL } from './config';

export const registrarUsuario = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/usuarios/registro`, formData);
    return response.data;
};

export const iniciarSesionUsuario = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/usuarios/login`, formData);
    return response.data;
};
