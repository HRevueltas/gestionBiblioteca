import React from 'react';
import { useAuthStore } from '../../stores/auth/auth.store';
import styles from './DejarOpinion.module.css';
import { dejarOpinion } from '../../services/opinionServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';

export const DejarOpinion = ({ libroId }) => {
  const { user, status } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    if (status !== 'authenticated') {
      toast.error('Por favor, inicie sesión para dejar una opinión.', {
        position: 'top-center',
      });
      return;
    }

    const opinionData = {
      usuario_id: user.id,
      libro_id: libroId,
      opinion: data.opinion,
    };

    try {
      await dejarOpinion(opinionData);
      toast.success('Opinión enviada exitosamente', {
        position: 'top-center',
      });
      reset(); // Limpia el formulario después de enviar
    } catch (error) {
      const errorMessage = error.response.data.error;
      toast.error(errorMessage, {
        position: 'top-center',
      });
      console.error('Error al enviar la opinión:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Dejar una Opinión</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("opinion", { required: true })}
          placeholder="Escribe tu opinión aquí..."
          className={styles.textarea}
        />
        {errors.opinion && <p className={styles.error}>Este campo es obligatorio</p>}
        <button type="submit" className={styles.submitButton}>Enviar Opinión</button>
      </form>
    </div>
  );
};