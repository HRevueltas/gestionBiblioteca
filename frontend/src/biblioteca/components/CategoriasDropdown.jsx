import React from 'react';
import { Link } from 'react-router-dom';
import estilos from './CategoriasDropdown.module.css';

export const CategoriasDropdown = ({ categoria, categoriasAgrupadas,  eventType}) => {
  return (
    <ul className={`${estilos.dropdownMenu}  animate__animated  ${eventType === 'click' ? 'animate__faster animate__fadeOut' : 'animate__fadeIn  animate__faster '}
    `}>
      {categoriasAgrupadas[categoria].map((subcategoria) => (
        <li key={subcategoria} className ={ estilos.dropdownItem}>
          <Link to={`/busqueda?q=${subcategoria}`} className={estilos.dropdownSubcategoryLink}>
            {subcategoria}
          </Link>
        </li>
      ))}
    </ul>
  );
};

