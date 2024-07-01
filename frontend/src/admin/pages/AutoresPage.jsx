import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { obtenerAutores, agregarAutor, eliminarAutor, editarAutor as editarAutorService } from '../../services/adminService';
import { toast } from 'react-toastify';

export const AutoresPage = () => {
  const [autores, setAutores] = useState([]);
  const [nuevoAutor, setNuevoAutor] = useState({ nombre: '', nacionalidad: '' });
  const [editarId, setEditarId] = useState(null);
  const [editarAutor, setEditarAutor] = useState({ nombre: '', nacionalidad: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [autorAEliminar, setAutorAEliminar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const data = await obtenerAutores();
        setAutores(data);
      } catch (error) {
        console.error('Error al obtener autores:', error);
      }
    };

    fetchAutores();
  }, []);

  const handleAgregarAutor = async () => {

    // Verificar que nombre y nacionalidad no estén vacíos
    if (!nuevoAutor.nombre.trim() || !nuevoAutor.nacionalidad.trim()) {
      toast.error('Por favor ingresa un nombre y nacionalidad válidos');
      return;
    }
    try {
      const nuevo = await agregarAutor(nuevoAutor);
      setAutores([...autores, nuevo]);
      setNuevoAutor({ nombre: '', nacionalidad: '' });
      toast.success('Autor agregado exitosamente');
    } catch (error) {
      toast.error('Error al agregar autor');
      console.error('Error al agregar autor:', error);
    }
  };

  const handleEliminarAutor = async (id) => {
    try {
      await eliminarAutor(id);
      setAutores(autores.filter((autor) => autor.id !== id));
      toast.success('Autor eliminado exitosamente');
      setDialogOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('No se puede eliminar el autor porque está asociado a uno o más libros');
      } else {
        toast.error('Error al eliminar autor');
      }
      console.error('Error al eliminar autor:', error);
    }
  };

  const handleEditarAutor = async () => {
     // Verificar que nombre y nacionalidad no estén vacíos
     if (!editarAutor.nombre.trim() || !editarAutor.nacionalidad.trim()) {
      toast.error('Por favor ingresa un nombre y nacionalidad válidos');
      return;
  }
    try {
      await editarAutorService(editarId, editarAutor);
      setAutores(
        autores.map((autor) =>
          autor.id === editarId ? { ...autor, ...editarAutor } : autor
        )
      );
      setEditarId(null);
      setEditarAutor({ nombre: '', nacionalidad: '' });
      toast.success('Autor editado exitosamente');
    } catch (error) {
      toast.error('Error al editar autor');
      console.error('Error al editar autor:', error);
    }
  };

  const openDialog = (autor) => {
    setAutorAEliminar(autor);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setAutorAEliminar(null);
  };

  const filteredAutores = autores.filter(autor =>
    autor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestión de Autores
      </Typography>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">

        <Typography variant="h6">Agregar nuevo autor:</Typography>

        <TextField
          label="Nombre Autor"
          variant="outlined"
          value={nuevoAutor.nombre}
          onChange={(e) => setNuevoAutor({ ...nuevoAutor, nombre: e.target.value })}
          style={{ marginRight: '8px' }}
        />
        <TextField
          label="Nacionalidad"
          variant="outlined"
          value={nuevoAutor.nacionalidad}
          onChange={(e) => setNuevoAutor({ ...nuevoAutor, nacionalidad: e.target.value })}
          style={{ marginRight: '8px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAgregarAutor}>
          Agregar Autor
        </Button>
      </Box>
      <TextField
        label="Buscar Autor"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px' }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Nacionalidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAutores.map((autor) => (
              <TableRow key={autor.id}>
                <TableCell>{autor.id}</TableCell>
                <TableCell>
                  {editarId === autor.id ? (
                    <TextField
                      value={editarAutor.nombre}
                      onChange={(e) => setEditarAutor({ ...editarAutor, nombre: e.target.value })}
                    />
                  ) : (
                    autor.nombre
                  )}
                </TableCell>
                <TableCell>
                  {editarId === autor.id ? (
                    <TextField
                      value={editarAutor.nacionalidad}
                      onChange={(e) => setEditarAutor({ ...editarAutor, nacionalidad: e.target.value })}
                    />
                  ) : (
                    autor.nacionalidad
                  )}
                </TableCell>
                <TableCell>
                  {editarId === autor.id ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEditarAutor}
                    >
                      Guardar
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setEditarId(autor.id);
                          setEditarAutor({ nombre: autor.nombre, nacionalidad: autor.nacionalidad });
                        }}
                        style={{ marginRight: '8px' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => openDialog(autor)}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Eliminar Autor"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar al autor {autorAEliminar?.nombre}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleEliminarAutor(autorAEliminar.id)}
            color="primary"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
