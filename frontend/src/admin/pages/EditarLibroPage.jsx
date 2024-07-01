import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerLibroConEjemplaresPorId, agregarEjemplar, actualizarLibro } from '../../services/adminService';
import { TextField, Button, Grid, Typography, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';

export const EditarLibroPage = () => {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const [ejemplares, setEjemplares] = useState([]);

  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const data = await obtenerLibroConEjemplaresPorId(id);
        setLibro(data[0]); // Tomar el primer elemento del array (debería ser único por el ID)
        setEjemplares(data.map(ejemplar => ({
          ...ejemplar, // Incluir todos los campos del ejemplar
        })));
      } catch (error) {
        toast.error('Error al obtener el libro');
        console.error('Error al obtener el libro:', error);
      }
    };

    fetchLibro();
  }, [id]);

  const handleChangeLibro = (e) => {
    setLibro({
      ...libro,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgregarEjemplar = async () => {
    try {
      const nuevoEjemplar = {
        numero_ejemplar: ejemplares.length + 1, // Generar el número automáticamente
        estado: 'disponible', // Estado por defecto al agregar un nuevo ejemplar
      };
      await agregarEjemplar(id, nuevoEjemplar);
      const data = await obtenerLibroConEjemplaresPorId(id);
      setEjemplares(data.map(ejemplar => ({
        ...ejemplar, // Incluir todos los campos del ejemplar
      })));
      toast.success('Ejemplar agregado con éxito');
    } catch (error) {
      toast.error('Error al agregar ejemplar');
      console.error('Error al agregar ejemplar:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(libro).some(value => value === '')) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    try {
      await actualizarLibro(id, libro);
      toast.success('Libro actualizado con éxito');
    } catch (error) {
      toast.error('Error al actualizar el libro');
      console.error('Error al guardar el libro:', error);
    }
  };

  if (!libro) {
    return <Typography variant="h6">Cargando...</Typography>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Editar Libro - ID: {id}</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="titulo"
              label="Título"
              variant="outlined"
              fullWidth
              value={libro.titulo}
              onChange={handleChangeLibro}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="imagen_url"
              label="Imagen URL"
              variant="outlined"
              fullWidth
              value={libro.imagen_url}
              onChange={handleChangeLibro}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="editorial"
              label="Editorial"
              variant="outlined"
              fullWidth
              value={libro.editorial}
              onChange={handleChangeLibro}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="ano"
              label="Año"
              variant="outlined"
              fullWidth
              type="number"
              value={libro.ano}
              onChange={handleChangeLibro}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="idioma"
              label="Idioma"
              variant="outlined"
              fullWidth
              value={libro.idioma}
              onChange={handleChangeLibro}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="npaginas"
              label="Páginas"
              variant="outlined"
              fullWidth
              type="number"
              value={libro.npaginas}
              onChange={handleChangeLibro}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="isbn13"
              label="ISBN-13"
              variant="outlined"
              fullWidth
              value={libro.isbn13}
              onChange={handleChangeLibro}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Ejemplares:</Typography>
            {ejemplares.map((ejemplar, index) => (
              <Card key={index} style={{ marginBottom: '10px' }}>
                <CardContent>
                  <Typography variant="body1">
                    Ejemplar {index + 1}: {ejemplar.estado}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAgregarEjemplar}
              style={{ marginRight: '10px' }}
            >
              Agregar Ejemplar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
