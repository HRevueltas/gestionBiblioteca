import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { BibliotecaRoutes } from '../biblioteca/routes/BibliotecaRoutes';
import { AdminRoutes } from '../admin/routes/AdminRoutes'; // Importa las rutas de administración

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/auth/*" element={<AuthRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} /> {/* Define las rutas de administración */}
                <Route path="/*" element={<BibliotecaRoutes />} />
                <Route path='*' element={<Navigate to='/auth/login' />} />
            </Routes>
        </>
    );
};
