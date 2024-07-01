import React, { useEffect, useState } from 'react';
import { obtenerCategorias, editarCategoria, eliminarCategoria, agregarCategoria } from '../../services/adminService';
import { Button, Container, Grid, IconButton, Paper, TextField, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationModal } from '../components/ConfirmationModal'; // Asegúrate de ajustar la ruta según sea necesario

export const CategoriasPage = () => {
    const [categorias, setCategorias] = useState([]);
    const [categoriasOriginales, setCategoriasOriginales] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [deleteCategory, setDeleteCategory] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const categoriasData = await obtenerCategorias();
                // Ordenar categorías por ID
                const categoriasOrdenadas = categoriasData.sort((a, b) => a.id - b.id);
                setCategorias(categoriasOrdenadas);
                setCategoriasOriginales(categoriasOrdenadas); // Guardar las categorías originales para restaurar después del filtro
            } catch (error) {
                console.error('Error al obtener categorías:', error);
            }
        };

        fetchCategorias();
    }, []);

    const handleEdit = (categoria) => {
        setEditMode(categoria.id);
        setEditValue(categoria.nombre);
    };

    const handleCancelEdit = () => {
        setEditMode(null);
        setEditValue('');
    };

    const handleSaveEdit = async (id) => {

        if (!editValue.trim()) {
            toast.error('El nombre de categoría no puede estar vacío');
            return;
        }

        try {
            await editarCategoria(id, editValue);
            setCategorias(categorias.map(categoria =>
                categoria.id === id ? { ...categoria, nombre: editValue } : categoria
            ));
            setEditMode(null);
            setEditValue('');
            toast.success('Categoría editada exitosamente');
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
            toast.error('Error al guardar la categoría');
        }
    };

    const confirmDelete = async () => {
        try {
            await eliminarCategoria(deleteCategory.id);
            setCategorias(categorias.filter(categoria => categoria.id !== deleteCategory.id));
            toast.success('Categoría eliminada exitosamente');
            setDeleteCategory(null); // Cerrar el modal de confirmación después de la eliminación
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            toast.error('Error al eliminar la categoría');
        }
    };

    const cancelDelete = () => {
        setDeleteCategory(null); // Cerrar el modal de confirmación sin eliminar la categoría
    };

    const openDeleteModal = (categoria) => {
        setDeleteCategory(categoria);
    };

    const handleBuscar = (e) => {
        const texto = e.target.value.toLowerCase();
        setFiltro(texto);
        const categoriasFiltradas = categoriasOriginales.filter(categoria =>
            categoria.nombre.toLowerCase().includes(texto)
        );
        setCategorias(categoriasFiltradas);
    };

    const limpiarFiltro = () => {
        setFiltro('');
        setCategorias(categoriasOriginales);
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error('El nombre de categoría no puede estar vacío');
            return;
        }
        try {
            await agregarCategoria(newCategory);
            const categoriasData = await obtenerCategorias();
            // Ordenar categorías por ID
            const categoriasOrdenadas = categoriasData.sort((a, b) => a.id - b.id);
            setCategorias(categoriasOrdenadas);
            setCategoriasOriginales(categoriasOrdenadas);
            setNewCategory('');
            toast.success('Categoría agregada exitosamente');
        } catch (error) {
            console.error('Error al agregar la categoría:', error);
            toast.error('Error al agregar la categoría');
        }
    };

    return (
        <Container>
            <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Categorías
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Buscar categorías"
                            value={filtro}
                            onChange={handleBuscar}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" justifyContent="flex-end">
                            {filtro && (
                                <Button onClick={limpiarFiltro} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                                    Limpiar filtro
                                </Button>
                            )}
                            <TextField
                                label="Nueva categoría"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                variant="outlined"
                                style={{ marginRight: '10px' }}
                            />
                            <Button onClick={handleAddCategory} variant="contained" color="primary">
                                Agregar Categoría
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="flex-start">ID</TableCell>
                            <TableCell align="flex-start">Nombre de Categoría</TableCell>
                            <TableCell align="flex-start">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categorias.map((categoria) => (
                            <TableRow key={categoria.id}>
                                <TableCell align="flex-start">{categoria.id}</TableCell>
                                <TableCell align="flex-start">
                                    {editMode === categoria.id ? (
                                        <TextField
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    ) : (
                                        categoria.nombre
                                    )}
                                </TableCell>
                                <TableCell align="flex-start">
                                    {editMode === categoria.id ? (
                                        <>
                                            <IconButton onClick={() => handleSaveEdit(categoria.id)} color="primary">
                                                <SaveIcon />
                                            </IconButton>
                                            <IconButton onClick={handleCancelEdit} color="secondary">
                                                <CancelIcon />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => handleEdit(categoria)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => openDeleteModal(categoria)} color="secondary">
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ToastContainer />
            {deleteCategory && (
                <ConfirmationModal
                    message={`¿Estás seguro de eliminar la categoría "${deleteCategory.nombre}"?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </Container>
    );
};
