const https = require('https');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

// Upload SSL certificate and private key
const privateKey = fs.readFileSync('/etc/letsencrypt/live/YOURBACKEND.ORG/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/YOURBACKEND.ORG/fullchain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate
};

const app = express();
const PORT = process.env.PORT || 8443;

// Logging of all requests
app.use((req, res, next) => {
	console.log(`Request received for: ${req.method} ${req.url}`);
	next();
});

// Import the router from 'app.js' and use it with the /api prefix
const apiRouter = require('./app');
app.use('/api', apiRouter);

console.log(`Inizializzazione del server HTTPS sulla porta ${PORT}`);
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
	console.log(`Server HTTPS in esecuzione su https://YOURBACKEND.ORG:${PORT}`);
});
