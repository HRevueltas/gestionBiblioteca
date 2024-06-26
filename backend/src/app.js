import express from 'express';
import morgan from 'morgan';
import envs from './config/envs';
import cors from 'cors';
import bodyParser from 'body-parser';
import bibliotecaRoutes from './routes/biblioteca.routes';
export const app = express();

// const corsOptions = {
//     origin: 'http://localhost:5173', 
//   }

app.use(cors());

// parse application/json
app.use(bodyParser.json());

app.set('port', envs.port);

app.use(morgan('dev'));

app.use(express.json());


app.use('/api/biblioteca', bibliotecaRoutes);