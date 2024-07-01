// src/pages/admin/PrestamosPage.jsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { obtenerPrestamosUsuario, actualizarEstadoPrestamo } from '../../services/adminService';
import { format } from 'date-fns';

export const PrestamosPage = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [prestamosFiltrados, setPrestamosFiltrados] = useState([]);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const prestamosData = await obtenerPrestamosUsuario();
        setPrestamos(prestamosData);
        setPrestamosFiltrados(prestamosData);
      } catch (error) {
        console.error('Error al obtener préstamos:', error);
      }
    };

    fetchPrestamos();
  }, []);

  const formatearFecha = (fecha) => {
    return format(new Date(fecha), 'dd/MM/yyyy');
  };

  const handleFiltroChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setFiltro(valor);
    filtrarPrestamos(valor, filtroEstado);
  };

  const handleFiltroEstadoChange = (e) => {
    const valor = e.target.value;
    setFiltroEstado(valor);
    filtrarPrestamos(filtro, valor);
  };

  const filtrarPrestamos = (filtroTexto, filtroEstado) => {
    const prestamosFiltrados = prestamos.filter(
      (prestamo) =>
        (prestamo.nombre.toLowerCase().includes(filtroTexto) ||
          prestamo.apellidos.toLowerCase().includes(filtroTexto) ||
          prestamo.email.toLowerCase().includes(filtroTexto) ||
          prestamo.titulo.toLowerCase().includes(filtroTexto)) &&
        (filtroEstado === '' || prestamo.estado === filtroEstado)
    );
    setPrestamosFiltrados(prestamosFiltrados);
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPrestamo(id, nuevoEstado);
      setPrestamos((prevPrestamos) =>
        prevPrestamos.map((prestamo) =>
          prestamo.id === id ? { ...prestamo, estado: nuevoEstado } : prestamo
        )
      );
      filtrarPrestamos(filtro, filtroEstado);
    } catch (error) {
      console.error('Error al actualizar estado del préstamo:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Préstamos de Usuarios
      </Typography>
      <TextField
        label="Buscar"
        variant="outlined"
        fullWidth
        value={filtro}
        onChange={handleFiltroChange}
        margin="normal"
      />
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="estado-label">Estado</InputLabel>
        <Select
          labelId="estado-label"
          id="estado"
          value={filtroEstado}
          onChange={handleFiltroEstadoChange}
          label="Estado"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="activo">Activo</MenuItem>
          <MenuItem value="devuelto">Devuelto</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha de Préstamo</TableCell>
              <TableCell>Fecha de Devolución</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Título del Libro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamosFiltrados.map((prestamo) => (
              <TableRow key={prestamo.id}>
                <TableCell>{prestamo.id}</TableCell>
                <TableCell>{formatearFecha(prestamo.fecha_prestamo)}</TableCell>
                <TableCell>{formatearFecha(prestamo.fecha_devolucion)}</TableCell>
                <TableCell>
                  <Select
                    value={prestamo.estado}
                    onChange={(e) => handleEstadoChange(prestamo.id, e.target.value)}
                  >
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="devuelto">Devuelto</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{prestamo.nombre}</TableCell>
                <TableCell>{prestamo.apellidos}</TableCell>
                <TableCell>{prestamo.email}</TableCell>
                <TableCell>{prestamo.titulo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
