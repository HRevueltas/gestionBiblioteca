// src/admin/components/Card.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Card.module.css';

export const Card = ({ title, count, icon, onClick }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.cardIcon}>{icon}</div>
            <div className={styles.cardInfo}>
                <h3>{title}</h3>
                <p>{count}</p>
            </div>
        </div>
    );
};

