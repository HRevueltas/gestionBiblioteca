import { useState } from "react";

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // Manejar el error de manera adecuada, por ejemplo, registrándolo
            console.error(`Error al obtener el valor de localStorage para la llave  "${key}":`, error);
            // Retornar el valor inicial en caso de error
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            // Actualizar el estado local
            setStoredValue(value);
            // Almacenar el valor en localStorage
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Manejar el error de manera adecuada, por ejemplo, registrándolo
            console.error(`Error  guardando el valor en localStorage para la llave "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};
 