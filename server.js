const https = require('https');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

// Carica il certificato SSL e la chiave privata
const privateKey = fs.readFileSync('/etc/letsencrypt/live/ttadev.org/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/ttadev.org/fullchain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
};

const app = express();
const PORT = process.env.PORT || 8443;

// Logging di tutte le richieste
app.use((req, res, next) => {
//    console.log(`Richiesta ricevuta per: ${req.method} ${req.url}`);
    next();
});

// Importa il router da 'app.js' e usalo con il prefisso /api
const apiRouter = require('./app');
app.use('/api', apiRouter);

console.log(`Inizializzazione del server HTTPS sulla porta ${PORT}`);
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
    console.log(`Server HTTPS in esecuzione su https://ttadev.org:${PORT}`);
});
