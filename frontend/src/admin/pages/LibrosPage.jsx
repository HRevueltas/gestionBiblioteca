import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Accordion, AccordionSummary, AccordionDetails, Chip, TextField, Box, Button, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

import { obtenerLibrosConEjemplares } from '../../services/adminService';
import { Paginacion } from '../components/Paginacion'; // Ajusta la ruta según tu estructura de archivos

// Función para truncar la URL de la imagen
const truncateUrl = (url, maxLength) => {
    if (url.length > maxLength) {
        return `${url.substring(0, maxLength)}...`;
    }
    return url;
};

export const LibrosPage = () => {
    const [libros, setLibros] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const resultsPerPage = 10; // Número de resultados por página

    useEffect(() => {
        const fetchLibros = async () => {
            try {
                const data = await obtenerLibrosConEjemplares();
                let filteredLibros = data;

                if (searchTerm.trim() !== '') {
                    filteredLibros = data.filter(libro =>
                        libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        libro.autores.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        libro.categorias.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                setLibros(filteredLibros);
                setTotalPages(Math.ceil(filteredLibros.length / resultsPerPage));
            } catch (error) {
                console.error('Error al obtener libros:', error);
            }
        };

        fetchLibros();
    }, [searchTerm]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderChips = (items) => {
        return items.split(', ').map((item, index) => (
            <Chip key={index} label={item} style={{ margin: '2px' }} />
        ));
    };

    const renderAccordions = (items, title) => {
        return (
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {items.split(', ').map((item, index) => (
                        <Typography key={index}>{item}</Typography>
                    ))}
                </AccordionDetails>
            </Accordion>
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Lista de Libros
            </Typography>
            <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <TextField
                    label="Buscar por título, autor o categoría"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Button
                    component={Link}
                    to="/admin/agregar"
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: '16px' }}
                >
                    Nuevo Libro
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Url imagen</TableCell>
                            <TableCell>Editorial</TableCell>
                            <TableCell>Año</TableCell>
                            <TableCell>Idioma</TableCell>
                            <TableCell>Número de Páginas</TableCell>
                            <TableCell>ISBN-13</TableCell>
                            <TableCell>Autores</TableCell>
                            <TableCell>Categorías</TableCell>
                            <TableCell>Número de Ejemplares</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {libros
                            .slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
                            .map(libro => (
                                <TableRow key={libro.id}>
                                    <TableCell>{libro.id}</TableCell>
                                    <TableCell>{libro.titulo}</TableCell>
                                    <TableCell>
                                        <Typography>
                                            {truncateUrl(libro.imagen_url, 30)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{libro.editorial}</TableCell>
                                    <TableCell>{libro.ano}</TableCell>
                                    <TableCell>{libro.idioma}</TableCell>
                                    <TableCell>{libro.npaginas}</TableCell>
                                    <TableCell>{libro.isbn13}</TableCell>
                                    <TableCell>{renderChips(libro.autores)}</TableCell>
                                    <TableCell>{renderChips(libro.categorias)}</TableCell>
                                    <TableCell>{libro.num_ejemplares}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            to={`/admin/editar/${libro.id}`}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Paginacion page={currentPage} count={totalPages} onChange={handlePageChange} />
        </Container>
    );
};

