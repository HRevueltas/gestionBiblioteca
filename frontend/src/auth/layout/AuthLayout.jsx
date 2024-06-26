import React from 'react';
import styles from '../layout/Layout.module.css';

export const AuthLayout = ({ children, title = '' }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.authBox} ${styles.boxShadow}`}>
        <h5 className={styles.title}>{title}</h5>
        {children}
      </div>
    </div>
  );
};
