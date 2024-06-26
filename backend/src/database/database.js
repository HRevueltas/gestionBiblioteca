import mysql from 'promise-mysql';

import envs from '../config/envs';
const conexion  = mysql.createConnection({
    host:  envs.host,
    user: envs.user,
    database: envs.database,
    password: ""
})

export const crearConexion =  () => {
    return conexion;
}
