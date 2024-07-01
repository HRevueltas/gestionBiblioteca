import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "./router/AppRouter"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Biblioteca = () => {
  return (
    <BrowserRouter>
    <AppRouter/>
    <ToastContainer limit={3}/>
    </BrowserRouter>
  )
} 
