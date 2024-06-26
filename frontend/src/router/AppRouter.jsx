import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { BibliotecaRoutes } from '../biblioteca/routes/BibliotecaRoutes';
export const AppRouter = () => {




    return (
        <>
            <Routes>
              
                     <Route path="/*" element={<BibliotecaRoutes />} />
                    
                     <Route path="/auth/*" element={<AuthRoutes />} />
                
                <Route path='/*' element={<Navigate to='/auth/login' />} />
              
            </Routes>
        </>
    );
};
