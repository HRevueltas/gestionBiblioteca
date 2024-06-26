import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Página no encontrada</p>
        <Link to="/inicio" className={styles.link}>Ir al inicio</Link>
      </div>
    </div>
  );
};

