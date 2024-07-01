import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './EditarLibroPage.module.css';

export const EditarLibroPage = () => {
  const { id } = useParams();

  return (
    <div className={styles.editarLibroPage}>
      <h1>Editar Libro - ID: {id}</h1>
      <form className={styles.form}>
        <label>Título:</label>
        <input type="text" />

        <label>Imagen URL:</label>
        <input type="text" />

        <label>Editorial:</label>
        <input type="text" />

        <label>Año:</label>
        <input type="number" />

        <label>Idioma:</label>
        <input type="text" />

        <label>Páginas:</label>
        <input type="number" />

        <label>ISBN-13:</label>
        <input type="text" />

        <label>Ejemplares:</label>
        <input type="number" />

        <button type="submit" className={styles.saveButton}>Guardar</button>
      </form>
    </div>
  );
};

