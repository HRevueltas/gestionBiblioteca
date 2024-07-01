import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerCantidadLibros, obtenerCantidadUsuarios, obtenerCantidadPrestamosActivos, obtenerCantidadOpiniones } from '../../services/adminService';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CommentIcon from '@mui/icons-material/Comment';
import { toast } from 'react-toastify';

export const DashboardPage = () => {
  const [cantidades, setCantidades] = useState({
    libros: 0,
    usuarios: 0,
    prestamos: 0,
    opiniones: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCantidades = async () => {
      try {
        const [libros, usuarios, prestamos, opiniones] = await Promise.all([
          obtenerCantidadLibros(),
          obtenerCantidadUsuarios(),
          obtenerCantidadPrestamosActivos(),
          obtenerCantidadOpiniones(),
        ]);
        setCantidades({
          libros: libros.cantidad,
          usuarios: usuarios.cantidad,
          prestamos: prestamos.cantidad,
          opiniones: opiniones.cantidad,
        });
      } catch (error) {
        toast.error('Error al obtener cantidades');
        console.error('Error al obtener cantidades:', error);
      }
    };

    fetchCantidades();
  }, []);

  const cards = [
    {
      title: 'Libros',
      cantidad: cantidades.libros,
      icon: <BookIcon style={{ fontSize: 32 }} />,
      route: '/admin/libros',
    },
    {
      title: 'Usuarios',
      cantidad: cantidades.usuarios,
      icon: <PeopleIcon style={{ fontSize: 32 }} />,
      route: '/admin/usuarios',
    },
    {
      title: 'Préstamos Activos',
      cantidad: cantidades.prestamos,
      icon: <AssignmentIcon style={{ fontSize: 32 }} />,
      route: '/admin/prestamos',
    },
    {
      title: 'Opiniones',
      cantidad: cantidades.opiniones,
      icon: <CommentIcon style={{ fontSize: 32 }} />,
      route: '/admin/opiniones',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Panel Administrativo</Typography>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {card.icon} {card.title}
                </Typography>
                <Typography variant="h6" component="div">
                  {card.cantidad}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(card.route)}
                  style={{ marginTop: '10px' }}
                >
                  Ver {card.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
