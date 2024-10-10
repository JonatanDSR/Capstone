import express from 'express';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import session from 'express-session';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { sql, connectToDatabase } from './database/db.js';  // Importa la conexión MSSQL

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

dotenv.config({ path: './env/.env' });

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Conectar a la base de datos MSSQL
connectToDatabase(); // Llama a la función para establecer la conexión





app.get('/', (req, res) => {
    res.render('index', {msg:'esto es un mensaje'}); 
})

app.get('/login', (req, res) => {
    res.render('login');
 
}) 

app.get('/registro', (req, res) => {
    res.render('registro');
 
}) 

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
