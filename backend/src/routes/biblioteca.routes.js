import { Router } from "express";
import {
    dejarOpinion,
    iniciarSesionUsuario,
    obtenerLibroPorId,
    obtenerLibros,
    obtenerPrestamosActivosUsuario,
    realizarPrestamo,
    registrarUsuario,
    totalEjemplaresDisponiblesPorLibroId,
    obtenerEjemplarDisponible,
    devolverPrestamo,
    obtenerOpinionLibro,
    

} from "../controllers";

import { actualizarLibro, agregarAutor, agregarCategoria,  agregarLibroConEjemplares, cambiarEstadoPrestamo, editarAutor, editarCategoria, editarUsuario, eliminarAutor, eliminarCategoria, eliminarLibro, eliminarUsuario, iniciarSesionAdmin, obtenerAutores, obtenerCategorias, obtenerLibrosConEjemplares, obtenerPrestamosUsuario, obtenerUsuariosRegistrados } from "../controllers/admin.controller";
const router = Router();

/*
? Ruta para obtener todos los libros con sus autores y categorías, y ruta para obtener un libro por su ID
 */
router.get("/libros", obtenerLibros);
// Ruta para obtener un libro por su ID
router.get("/libros/:id", obtenerLibroPorId);

// Ruta para obtener los ejemplares disponibles por ID de libro
router.get("/libros/:id/ejemplar", totalEjemplaresDisponiblesPorLibroId);

// ruta para obtener el primer ejemplar disponible para un libro específico
router.get("/libros/ejemplar/:id", obtenerEjemplarDisponible);

/* 
?Rutas para usuarios
*/
// ruta para registrar un usuario
router.post("/usuarios/registro", registrarUsuario);
// ruta para iniciar sesión
router.post("/usuarios/login", iniciarSesionUsuario);
// ruta para realizar un prestamo
router.post("/usuarios/prestamo", realizarPrestamo);
// ruta para obtener prestamos de un usuario 
router.get("/usuarios/prestamos/:usuario_id", obtenerPrestamosActivosUsuario);
// Ruta para devolver un préstamo
router.put('/prestamos/devolver/:prestamoId', devolverPrestamo);
 
/* 
TODO: Definir las ruta para dejar opinion sobre un libro 
*/
router.post("/usuarios/opinion", dejarOpinion);

// obtener las opiniones de un libro
router.get("/libros/opinion/:libro_id", obtenerOpinionLibro);



/**
 * TODO:  Falta  Definir las rutas para los administradores
 
 */
/* 
?Rutas para administradores
*/
router.post("/admin/login", iniciarSesionAdmin);
router.get("/admin/usuarios", obtenerUsuariosRegistrados);
router.delete("/admin/usuarios/eliminar/:id", eliminarUsuario);
router.put("/admin/usuarios/editar/:id", editarUsuario);
router.get("/admin/libros", obtenerLibrosConEjemplares);

// Rutas para categorias
router.post("/admin/categorias/agregar", agregarCategoria);
router.get("/admin/categorias", obtenerCategorias);
router.put('/admin/categorias/:id', editarCategoria);
router.delete('/admin/categorias/:id', eliminarCategoria);

//Rutas para autores
router.post("/admin/autores/agregar", agregarAutor);
router.get("/admin/autores", obtenerAutores);
router.put('/admin/autores/:id', editarAutor);
router.delete('/admin/autores/:id', eliminarAutor);

router.post("/admin/libros/agregar", agregarLibroConEjemplares);
router.put("/admin/libros/actualizar/:id", actualizarLibro);
router.delete("/admin/libros/eliminar/:id", eliminarLibro);

// obtener prestamos
router.get("/admin/prestamos", obtenerPrestamosUsuario);

// actualizar estado de prestamo
router.put("/admin/prestamos/actualizar/:id", cambiarEstadoPrestamo);

export default router;
