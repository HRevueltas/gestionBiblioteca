// src/services/adminService.js

import axios from "axios";
import { API_BASE_URL } from "../api/config";

export const obtenerUsuarios = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/usuarios`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

export const eliminarUsuario = async (usuarioId) => {
    try {
        await axios.delete(`${API_BASE_URL}/admin/usuarios/eliminar/${usuarioId}`);
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
};

export const restablecerContrasena = async (id, nuevaContrasena) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/admin/usuarios/${id}/restablecer-contrasena`, { nuevaContrasena });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editarUsuario = async (usuarioId, datos) => {
    try {
        await axios.put(`${API_BASE_URL}/admin/usuarios/editar/${usuarioId}`, datos);
    } catch (error) {
        console.error('Error al editar usuario:', error);
        throw error;
    }
};
 

export const obtenerLibrosConEjemplares = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/libros`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener libros:', error);
        throw error;
    }
}


// Rutas para categorias
export const agregarCategoria = async (nombre) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/categorias/agregar`, { nombre });
        return response.data;

    } catch (error) {
        console.error('Error al agregar categoría:', error);
        throw error;
    }
}

export const obtenerCategorias = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/categorias`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
    }
}


export const editarCategoria = async (id, nombre) => {
    try {
        await axios.put(`${API_BASE_URL}/admin/categorias/${id}`, { nombre });
    } catch (error) {
        console.error('Error al editar categoría:', error);
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/admin/categorias/${id}`);
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        throw error;
    }
};

// Rutas para autores

export const agregarAutor = async (nombre, nacionalidad) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/autores/agregar`, nombre , nacionalidad);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error al agregar autor:', error);
        throw error;
    } 
}

export const obtenerAutores = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/autores`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener autores:', error);
        throw error;
    }
}

export const editarAutor = async (id, nombre, nacionalidad) => {
    try {
        await axios.put(`${API_BASE_URL}/admin/autores/${id}`, nombre, nacionalidad);
    } catch (error) {
        console.error('Error al editar autor:', error);
        throw error;
    }
};

export const eliminarAutor = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/admin/autores/${id}`);
    } catch (error) {
        console.error('Error al eliminar autor:', error);
        throw error;
    }
};


export const agregarLibroNuevo = async (datos) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/libros/agregar`, datos);
        return response.data;
    } catch (error) {
        console.error('Error al agregar libro:', error);
        throw error;
    }
}

export const actualizarLibro = async (id, datos) => {
    try {
        await axios.put(`${API_BASE_URL}/admin/libros/actualizar/${id}`, datos);
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        throw error;
    }
}


// prestamos 

export const obtenerPrestamosUsuario = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/prestamos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener prestamos:', error);
        throw error;
    }
}

export const  actualizarEstadoPrestamo = async (id, estado) => {

    try {
        await axios.put(`${API_BASE_URL}/admin/prestamos/actualizar/${id}`, { estado });
    } catch (error) {
        console.error('Error al actualizar estado de prestamo:', error);
        throw error;
    }
}
    

// opiniones de usuarios

export const obtenerOpinionesUsuarios = async () => {

    try {
        const response = await axios.get(`${API_BASE_URL}/admin/opiniones`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener opiniones:', error);
        throw error;
    }
}

export const eliminarOpinion = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/admin/opiniones/eliminar/${id}`);
    } catch (error) {
        console.error('Error al borrar opinion:', error);
        throw error;
    }
}

export const  obtenerLibroConEjemplaresPorId = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/libros/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener libro:', error);
        throw error;
    }
}

export const agregarEjemplar = async (libroId, datos) => {
    try {
        await axios.post(`${API_BASE_URL}/admin/ejemplares/agregar/${libroId}`, datos);
    } catch (error) {
        console.error('Error al agregar ejemplar:', error);
        throw error;
    }
}

export const obtenerCantidadLibros = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/total/libros`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cantidad de libros:', error);
        throw error;
    }
}

export const obtenerCantidadUsuarios = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/total/usuarios`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cantidad de usuarios:', error);
        throw error;
    }
}

export const obtenerCantidadPrestamosActivos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/total/prestamos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cantidad de prestamos:', error);
        throw error;
    }
}

export const obtenerCantidadOpiniones = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/total/opiniones`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cantidad de opiniones:', error);
        throw error;
    }
}
