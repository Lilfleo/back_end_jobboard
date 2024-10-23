const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

module.exports = { pool }; // Assure-toi que le pool est exporté correctement


console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

pool.connect()
    .then(() => console.log('Connecté à la base de données'))
    .catch(err => console.error('Erreur de connexion', err));


    