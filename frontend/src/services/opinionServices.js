import axios from "axios";
import { API_BASE_URL } from "../api/config";

export const dejarOpinion = async (opinionData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/usuarios/opinion`, opinionData);
        return response.data;
    } catch (error) {
        console.error('Error al dejar la opinión:', error);
        throw error;
    }
}
export const obtenerOpinion = async (libroId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/libros/opinion/${libroId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la opinión:', error);
        throw error;
    }
}   