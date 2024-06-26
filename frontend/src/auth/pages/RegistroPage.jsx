import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { AuthLayout } from '../layout/AuthLayout';
import styles from './RegistroPage.module.css';
import { useAuthStore } from '../../stores/auth/auth.store';
import { registrarUsuario } from '../../api/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
export const RegistroPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false)
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const onSubmit = async (data) => {
        setMensaje('');
        setError('');
        try {
            const response = await registrarUsuario(data);
            setMensaje(response.message);
            login(response.usuario);
            navigate('/inicio');
            reset(); // Reinicia el formulario después de enviarlo exitosamente
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.error.includes('email')) {
                setError('El correo electrónico ya está registrado. Por favor, utiliza otro correo electrónico.');
            } else if (error.response && error.response.data && error.response.data.error.includes('cedula')) {
                setError('La cédula ya se encuentra registrada.');
            } else {
                setError('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
            }
        }
    };

    const contrasenaVisible = () => {
        setMostrarContrasena(!mostrarContrasena);
    }
        

    return (
        <AuthLayout title="Registro de Usuario">
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" {...register('nombre', { required: true })} />
                        {errors.nombre && <p className={styles.errorMessage}>Este campo es requerido.</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="apellidos">Apellidos</label>
                        <input type="text" id="apellidos" name="apellidos" {...register('apellidos', { required: true })} />
                        {errors.apellidos && <p className={styles.errorMessage}>Este campo es requerido.</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" {...register('email', {
                            required: "Este campo es requerido.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Por favor, introduce un correo electrónico válido."
                            }
                        })} />
                        {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                    <label htmlFor="contrasena">Contraseña</label>
                        <div className={styles.passwordInputContainer}>
                            <input type={mostrarContrasena ? "text" : "password"} id="contrasena" name="contrasena" {...register('contrasena', { required: true })} />
                            <button type="button" onClick={contrasenaVisible} className={styles.passwordToggleButton}>
                                {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.contrasena && <p className={styles.errorMessage}>Este campo es requerido.</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="celular">Número de Celular</label>
                        <input type="text" id="celular" name="celular" {...register('celular', { required: true })} />
                        {errors.celular && <p className={styles.errorMessage}>Este campo es requerido.</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="cedula">Cédula</label>
                        <input type="text" id="cedula" name="cedula" {...register('cedula', { required: true })} />
                        {errors.cedula && <p className={styles.errorMessage}>Este campo es requerido.</p>}
                    </div>
                    <button type="submit" className={styles.button}>Registrar</button>

                    <p>
                        ¿Ya tienes una cuenta? <a href="/auth/login">Inicia sesión</a>
                    </p>
                </form>

                {error && <p className={styles.errorMessage}>{error}</p>}
                {mensaje && <p className={styles.successMessage}>{mensaje}</p>}
            </div>
        </AuthLayout>
    );
};
