// src/admin/ui/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavBar } from '../components/AdminNavBar';
import styles from './AdminLayout.module.css';

export const AdminLayout = () => {
    return (
        <div className={styles.adminLayout}>
            <AdminNavBar />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};
