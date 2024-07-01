// src/admin/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LibrosPage } from '../pages/LibrosPage';
import { PrestamosPage } from '../pages/PrestamosPage';
import { UsuariosPage } from '../pages/UsuariosPage';
import { OpinionesPage } from '../pages/OpinionesPage';
import { useAuthAdminStore } from '../../stores/auth/authAdmin.store';
import { EditarLibroPage } from '../pages/EditarLibroPage';
import { CategoriasPage } from '../pages/CategoriasPage';
import { NuevoLibroPage } from '../pages/NuevoLibroPage';
import { AutoresPage } from '../pages/AutoresPage';

export const AdminRoutes = () => {
    const status = useAuthAdminStore(
        (state) => state.status
    );

    console.log(status);

    // if (status === 'checking') {
    //     return <div>Loading...</div>;
    // }

    return (
        <Routes>
            {status === 'authenticated' ? (
                <Route path="/" element={<AdminLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="libros" element={<LibrosPage />} />
                    <Route path="prestamos" element={<PrestamosPage />} />
                    <Route path="usuarios" element={<UsuariosPage />} />
                    <Route path="opiniones" element={<OpinionesPage />} />
                    <Route path= "editar/:id" element={<EditarLibroPage />} />
                    <Route path= "categorias" element={<CategoriasPage />} />
                    <Route path= "autores" element={<AutoresPage/>} />
                    <Route path="agregar" element={ <NuevoLibroPage/>} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Route>
            ) : (
                <>
                    <Route path="login" element={<AdminLoginPage />} />
                    <Route path="*" element={<Navigate to="login" />} />
                </>
            )}
        </Routes>
    );
};
