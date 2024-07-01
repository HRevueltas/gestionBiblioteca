import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../auth/layout/AuthLayout';
import { useNavigate } from 'react-router';
import { iniciarSesionAdmin } from '../../api/auth';
import styles from './AdminLoginPage.module.css';
import { useAuthAdminStore } from '../../stores/auth/authAdmin.store';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const AdminLoginPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const navigate = useNavigate();
    const loginAdmin = useAuthAdminStore(state => state.login);

    const onLogin = async (data) => {
        setMensaje('');
        setError('');
        try {
            const response = await iniciarSesionAdmin(data);
            loginAdmin(response.admin); // Almacenar el estado de autenticación del admin
            setMensaje('Inicio de sesión exitoso');
            navigate('/admin/dashboard'); // Redirige al admin al dashboard después de iniciar sesión
            reset();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
            }
        }
    };

    const contrasenaVisible = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

    return (
        <AuthLayout title="Iniciar sesión como administrador">
            <form onSubmit={handleSubmit(onLogin)} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="usuario">Usuario</label>
                    <input
                        type="text"
                        id="usuario"
                        name="usuario"
                        {...register('usuario', { required: 'Este campo es requerido' })}
                    />
                    {errors.usuario && <p className={styles.errorMessage}>{errors.usuario.message}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="contrasena">Contraseña</label>
                    <div className={styles.passwordInputContainer}>
                        <input
                            type={mostrarContrasena ? "text" : "password"}
                            id="contrasena"
                            name="contrasena"
                            {...register('contrasena', { required: 'Este campo es requerido' })}
                        />
                        <button type="button" onClick={contrasenaVisible} className={styles.passwordToggleButton}>
                            {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.contrasena && <p className={styles.errorMessage}>{errors.contrasena.message}</p>}
                </div>

                <button type="submit" className={styles.button}>Iniciar sesión</button>
            </form>

            {error && <p className={styles.errorMessage}>{error}</p>}
            {mensaje && <p className={styles.successMessage}>{mensaje}</p>}


        </AuthLayout>
    );
};
