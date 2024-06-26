import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../layout/AuthLayout';
import { useNavigate } from 'react-router';
import { iniciarSesionUsuario } from '../../api/auth';
import styles from './LoginPage.module.css';
import { useAuthStore } from '../../stores/auth/auth.store';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const LoginPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false)
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const onLogin = async (data) => {
        setMensaje('');
        setError('');
        try {
            const response = await iniciarSesionUsuario(data);
            login(response.usuario);
            setMensaje('Inicio de sesión exitoso');
            navigate('/inicio'); // Redirige al usuario a la página principal después de iniciar sesión
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
    }


    return (
        <AuthLayout title="Iniciar sesión">
            <form onSubmit={handleSubmit(onLogin)} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        {...register('email', { required: 'Este campo es requerido' })}
                    />
                    {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
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

            <p>
                ¿No tienes una cuenta? <a href="/auth/registro">Regístrate</a>
            </p>
        </AuthLayout>
    );
};
