import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { obtenerUsuarios, eliminarUsuario, editarUsuario } from '../../services/adminService';
import { ConfirmationModal } from '../components/ConfirmationModal'; // Importar el componente de confirmación

export const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUsuario, setEditingUsuario] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar/ocultar modal de confirmación
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();
    const [userIdToDelete, setUserIdToDelete] = useState(null); // Estado para almacenar ID de usuario a eliminar

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await obtenerUsuarios();
                setUsuarios(data);
            } catch (error) {
                toast.error('Error al obtener usuarios', {
                    position: 'top-center',
                    autoClose: 3000,
                });
                console.error('Error al obtener usuarios:', error);
            }
        };

        fetchUsuarios();
    }, []);

    const handleEditClick = (usuario) => {
        setEditingUsuario(usuario.id); // Establece el usuario que se está editando
        setValue('nombre', usuario.nombre);
        setValue('apellidos', usuario.apellidos);
        setValue('email', usuario.email);
        setValue('celular', usuario.celular);
        setValue('cedula', usuario.cedula);
    };

    const handleDeleteClick = (usuarioId) => {
        setUserIdToDelete(usuarioId); // Guardar el ID del usuario a eliminar
        setShowConfirmation(true); // Mostrar modal de confirmación
    };

    const confirmDelete = async () => {
        try {
            await eliminarUsuario(userIdToDelete);
            setUsuarios(usuarios.filter(usuario => usuario.id !== userIdToDelete));
            toast.success('Usuario eliminado exitosamente', {
                position: 'top-center',
                autoClose: 3000,
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error, {
                    position: 'top-center',
                    autoClose: 3000,
                });
            } else {
                toast.error('Error al eliminar usuario', {
                    position: 'top-center',
                    autoClose: 3000,
                });
            }
            console.error('Error al eliminar usuario:', error);
        } finally {
            setShowConfirmation(false); // Ocultar modal de confirmación después de confirmar
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false); // Ocultar modal de confirmación si el usuario cancela
    };

    const handleSaveEdit = async (data) => {
        try {
            await editarUsuario(editingUsuario, data);
            const updatedUsuarios = usuarios.map(usuario =>
                usuario.id === editingUsuario ? { ...usuario, ...data } : usuario
            );
            setUsuarios(updatedUsuarios);
            setEditingUsuario(null);
            toast.success('Usuario editado exitosamente', {
                position: 'top-center',
                autoClose: 3000,
            });
            reset(); // Resetear el formulario después de editar
        } catch (error) {
            toast.error('Error al editar usuario', {
                position: 'top-center',
                autoClose: 3000,
            });
            console.error('Error al editar usuario:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingUsuario(null);
        reset(); // Resetear el formulario al cancelar edición
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Usuarios Registrados</Typography>
            <TextField
                variant="outlined"
                fullWidth
                placeholder="Buscar usuarios"
                value={searchTerm}
                onChange={handleSearchChange}
                margin="normal"
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellidos</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Celular</TableCell>
                            <TableCell>Cédula</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsuarios.map(usuario => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.id}</TableCell>
                                <TableCell>
                                    {editingUsuario === usuario.id ? (
                                        <TextField
                                            {...register('nombre', { required: 'Este campo es requerido' })}
                                            defaultValue={usuario.nombre}
                                            error={!!errors.nombre}
                                            helperText={errors.nombre && errors.nombre.message}
                                            fullWidth
                                        />
                                    ) : (
                                        usuario.nombre
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingUsuario === usuario.id ? (
                                        <TextField
                                            {...register('apellidos', { required: 'Este campo es requerido' })}
                                            defaultValue={usuario.apellidos}
                                            error={!!errors.apellidos}
                                            helperText={errors.apellidos && errors.apellidos.message}
                                            fullWidth
                                        />
                                    ) : (
                                        usuario.apellidos
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingUsuario === usuario.id ? (
                                        <TextField
                                            {...register('email', { required: 'Este campo es requerido' })}
                                            defaultValue={usuario.email}
                                            error={!!errors.email}
                                            helperText={errors.email && errors.email.message}
                                            fullWidth
                                        />
                                    ) : (
                                        usuario.email
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingUsuario === usuario.id ? (
                                        <TextField
                                            {...register('celular', { required: 'Este campo es requerido' })}
                                            defaultValue={usuario.celular}
                                            error={!!errors.celular}
                                            helperText={errors.celular && errors.celular.message}
                                            fullWidth
                                        />
                                    ) : (
                                        usuario.celular
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingUsuario === usuario.id ? (
                                        <TextField
                                            {...register('cedula', { required: 'Este campo es requerido' })}
                                            defaultValue={usuario.cedula}
                                            error={!!errors.cedula}
                                            helperText={errors.cedula && errors.cedula.message}
                                            fullWidth
                                        />
                                    ) : (
                                        usuario.cedula
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingUsuario === usuario.id ? (
                                        <Box display="flex" gap={1}>
                                            <Button variant="contained" color="primary" disabled={isSubmitting} onClick={handleSubmit(handleSaveEdit)}>Guardar</Button>
                                            <Button variant="outlined" onClick={handleCancelEdit}>Cancelar</Button>
                                        </Box>
                                    ) : (
                                        <Box display="flex" gap={1}>
                                            <IconButton onClick={() => handleEditClick(usuario)}><Edit /></IconButton>
                                            <IconButton onClick={() => handleDeleteClick(usuario.id)}><Delete /></IconButton>
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {showConfirmation && (
                <ConfirmationModal
                    message="¿Estás seguro de que deseas eliminar este usuario?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </Container>
    );
};
