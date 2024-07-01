// components/NuevoLibroPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { obtenerCategorias, obtenerAutores, agregarLibroNuevo } from '../../services/adminService'; // Importamos los métodos del servicio

export const NuevoLibroPage = () => {
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [editorial, setEditorial] = useState('');
  const [ano, setAno] = useState('');
  const [idioma, setIdioma] = useState('');
  const [npaginas, setNpaginas] = useState('');
  const [isbn13, setIsbn13] = useState('');
  const [selectedAutores, setSelectedAutores] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [cantidadEjemplares, setCantidadEjemplares] = useState(1); // Estado para la cantidad de ejemplares a agregar
  const [ejemplares, setEjemplares] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const autoresData = await obtenerAutores();
        setAutores(autoresData);

        const categoriasData = await obtenerCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener autores y categorías:', error);
      }
    };

    fetchData();
  }, []);

  const validarFormulario = () => {
    if (!titulo || !editorial || !isbn13) {
      toast.error('Todos los campos marcados (*) son obligatorios.');
      return false;
    }

    if (!/^\d{13}$/.test(isbn13)) {
      toast.error('El formato del ISBN-13 no es válido.');
      return false;
    }

    if (selectedAutores.length === 0) {
      toast.error('Debe seleccionar al menos un autor.');
      return false;
    }

    if (selectedCategorias.length === 0) {
      toast.error('Debe seleccionar al menos una categoría.');
      return false;
    }

    return true;
  };

  const handleAgregarLibroYEjemplares = async () => {
    try {
      if (!validarFormulario()) {
        return;
      }

      const data = {
        titulo,
        imagen_url: imagenUrl,
        editorial,
        ano: parseInt(ano),
        idioma,
        npaginas: parseInt(npaginas),
        isbn13,
        autores: selectedAutores,
        categorias: selectedCategorias,
        cantidad_ejemplares: cantidadEjemplares,
      };

      // Agregar el libro y ejemplares simultáneamente
      await agregarLibroNuevo(data);

      toast.success('Libro y ejemplares agregados exitosamente');

      // Limpiar los campos después de agregar el libro y ejemplares
      setTitulo('');
      setImagenUrl('');
      setEditorial('');
      setAno('');
      setIdioma('');
      setNpaginas('');
      setIsbn13('');
      setSelectedAutores([]);
      setSelectedCategorias([]);
      setEjemplares([]);
      setCantidadEjemplares(1);
    } catch (error) {
      console.error('Error al agregar el libro y ejemplares:', error);
      toast.error('Error al agregar el libro y ejemplares');
    }
  };

  const handleLimpiarAutores = () => {
    setSelectedAutores([]);
  };

  const handleLimpiarCategorias = () => {
    setSelectedCategorias([]);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Agregar Nuevo Libro
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="URL de Imagen"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Editorial"
            value={editorial}
            onChange={(e) => setEditorial(e.target.value)}
            fullWidth
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Año"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            fullWidth
            variant="outlined"
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Idioma"
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Número de Páginas"
            value={npaginas}
            onChange={(e) => setNpaginas(e.target.value)}
            fullWidth
            variant="outlined"
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="ISBN-13"
            value={isbn13}
            onChange={(e) => setIsbn13(e.target.value)}
            fullWidth
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="autores-label">Autores *</InputLabel>
            <Select
              labelId="autores-label"
              id="autores"
              multiple
              value={selectedAutores}
              onChange={(e) => setSelectedAutores(e.target.value)}
              label="Autores"
              fullWidth
              required
            >
              {autores.map((autor) => (
                <MenuItem key={autor.id} value={autor.id}>
                  {autor.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleLimpiarAutores}>
            Limpiar Autores
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="categorias-label">Categorías *</InputLabel>
            <Select
              labelId="categorias-label"
              id="categorias"
              multiple
              value={selectedCategorias}
              onChange={(e) => setSelectedCategorias(e.target.value)}
              label="Categorías"
              fullWidth
              required
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleLimpiarCategorias}>
            Limpiar Categorías
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cantidad de Ejemplares"
            value={cantidadEjemplares}
            onChange={(e) => setCantidadEjemplares(parseInt(e.target.value))}
            fullWidth
            variant="outlined"
            type="number"
            inputProps={{ min: 1 }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAgregarLibroYEjemplares}
          >
            Agregar Libro y Ejemplares
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};
