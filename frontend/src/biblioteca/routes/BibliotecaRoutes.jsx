import { Navigate, Route, Routes } from "react-router"
import { NavBar } from "../../ui/components/NavBar"
import { PrincipalPage } from "../pages/PrincipalPage"
import { AuthRoutes } from "../../auth/routes/AuthRoutes"
import { BookPage } from "../pages/BookPage"
import { BusquedaPage } from "../pages/BusquedaPage"
import { PrestamosPage } from "../pages/PrestamosPage"
import { NotFoundPage } from "../pages/NotFoundPage"

export const BibliotecaRoutes = () => {
    return ( 

        <>
<NavBar /> {/* Siempre muestra la barra de navegación */}
            <Routes>
                <Route path="/inicio" element={<PrincipalPage />} />
                <Route path="/prestamos" element={<PrestamosPage />} />
                <Route path="/libro/:id" element={<BookPage />} />
                <Route path="/busqueda" element={<BusquedaPage />} />

                {/* Ruta para la página de error 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    )
}
