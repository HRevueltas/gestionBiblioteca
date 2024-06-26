import { Route, Routes } from "react-router-dom"
import { LoginPage } from "../pages/LoginPage"
import { RegistroPage } from "../pages/RegistroPage"
// import { LoginPage, RegistroPage } from "./pages"

export const AuthRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/registro" element={<RegistroPage/>}/>
    </Routes>
  )
}
  