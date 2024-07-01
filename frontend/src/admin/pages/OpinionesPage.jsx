import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { obtenerOpinionesUsuarios, eliminarOpinion } from '../../services/adminService';
import DeleteIcon from '@mui/icons-material/Delete';

export const OpinionesPage = () => { 
  const [opiniones, setOpiniones] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedOpinionId, setSelectedOpinionId] = useState(null);

  useEffect(() => {
    const fetchOpiniones = async () => {
      try {
        const data = await obtenerOpinionesUsuarios();
        setOpiniones(data);
      } catch (error) {
        setError(error);
        toast.error('Error al obtener opiniones');
      }
    };

    fetchOpiniones();
  }, []);

  const handleClickOpen = (id) => {
    
    setSelectedOpinionId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      console.log('selectedOpinionId', selectedOpinionId);
      await eliminarOpinion(selectedOpinionId);
      setOpiniones(opiniones.filter(opinion => opinion.opinion_id !== selectedOpinionId));
      toast.success('Opinión eliminada exitosamente');
      handleClose();
    } catch (error) {
      toast.error('Error al eliminar opinión');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Opiniones de Usuarios
      </Typography>
      {error ? (
        <Typography color="error">Error al obtener opiniones: {error.message}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID opinión</TableCell>
                <TableCell>Opinión</TableCell>
                <TableCell>ID usuario</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>ID libro</TableCell>
                <TableCell>Título Libro</TableCell>
                <TableCell>Fecha Opinión</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opiniones.map((opinion) => (
                <TableRow key={opinion.id}>
                  <TableCell>{opinion.opinion_id}</TableCell>
                  <TableCell>{opinion.opinion}</TableCell>
                  <TableCell>{opinion.usuario_id}</TableCell>
                  <TableCell>{opinion.usuario_nombre}</TableCell>
                  <TableCell>{opinion.usuario_apellidos}</TableCell>
                  <TableCell>{opinion.libro_id}</TableCell>
                  <TableCell>{opinion.libro_titulo}</TableCell>
                  <TableCell>{new Date(opinion.fecha_opinion).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleClickOpen(opinion.opinion_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Confirmar Eliminación"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar esta opinión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

