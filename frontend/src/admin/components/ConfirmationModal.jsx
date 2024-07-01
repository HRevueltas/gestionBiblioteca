import React from 'react';
import styles from './ConfirmationModal.module.css';

export const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttonGroup}>
                    <button className={styles.confirmButton} onClick={onConfirm}>Confirmar</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

