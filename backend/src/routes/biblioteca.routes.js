import { Router } from "express";
import {
    actualizarLibro,
    agregarLibro,
    dejarOpinion,
    eliminarLibro,
    eliminarUsuario,
    iniciarSesionAdmin,
    iniciarSesionUsuario,
    obtenerLibroPorId,
    obtenerLibros,
    obtenerPrestamosUsuario,
    obtenerUsuariosRegistrados,
    realizarPrestamo,
    registrarUsuario,
    ejemplaresDisponiblesPorLibroId,
    totalEjemplaresDisponiblesPorLibroId,
    obtenerEjemplarDisponible,
    devolverPrestamo,
    obtenerOpinionLibro,
    

} from "../controllers";

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
router.get("/usuarios/prestamos/:usuario_id", obtenerPrestamosUsuario);
// Ruta para devolver un préstamo
router.put('/prestamos/devolver/:prestamoId', devolverPrestamo);
 
/* 
TODO: Definir las ruta para dejar opinion sobre un libro 
*/
router.post("/usuarios/opinion", dejarOpinion);

// obtener las opiniones de un libro
router.get("/libros/opinion/:libro_id", obtenerOpinionLibro);



/**
 * TODO: Definir las rutas para los administradores
 
 */
/* 
?Rutas para administradores
*/
router.post("/admin/login", iniciarSesionAdmin);
router.get("/admin/usuarios", obtenerUsuariosRegistrados);
router.post("/admin/libros/agregar", agregarLibro);
router.put("/admin/libros/actualizar/:id", actualizarLibro);
router.delete("/admin/libros/eliminar/:id", eliminarLibro);
router.delete("/admin/usuarios/eliminar/:id", eliminarUsuario);

export default router;
