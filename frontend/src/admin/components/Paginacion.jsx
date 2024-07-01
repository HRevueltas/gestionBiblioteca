import React from 'react';
import { Pagination } from '@mui/material';

export const Paginacion = ({ page, count, onChange }) => {
    const handleChange = (event, value) => {
        onChange(value);
    };

    return (
        <Pagination
            count={count}
            page={page}
            onChange={handleChange}
            color="primary"
            size="large"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
        />
    );
};

