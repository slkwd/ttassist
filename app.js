const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const router = express.Router();
require('dotenv').config();

const openai = new(require('openai'))();

// Carica variabili d'ambiente
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.ASSISTANT_ID;
const MODEL = process.env.MODEL;
const MAX_MESSAGES = process.env.MAX_MESSAGES ? parseInt(process.env.MAX_MESSAGES) : 10;

// Configura il CORS per accettare richieste dal dominio frontend specifico
const corsOptions = {
	origin: '*',
	methods: 'GET,POST,PUT,DELETE,OPTIONS',
	optionsSuccessStatus: 200,
	credentials: true
};
router.use(cors(corsOptions));

// Configura il rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100
});
router.use(limiter);

router.use(express.json()); // Middleware per il parsing JSON

// Inizializza la cronologia delle conversazioni e il timer di timeout
let conversationHistory = [];
let resetTimeout;

// Funzione per resettare la cronologia dopo un periodo di inattività
function resetConversation() {
	console.log("Reset della cronologia per inattività.");
	conversationHistory = [];
}

// Funzione per limitare la cronologia al numero massimo di messaggi configurato
function limitConversationHistory() {
	if (conversationHistory.length > MAX_MESSAGES) {
		conversationHistory = conversationHistory.slice(-MAX_MESSAGES);
	}
}

// Funzione per rimuovere i riferimenti alle fonti dal testo
function removeSources(text) {
	return text.replace(/【\d+:\d+†[^\]]*】/g, '');
}

// Rotta principale /ask
router.post('/ask', async (req, res) => {
	//    console.log('Richiesta ricevuta su /ask');
	console.log('Richiesta:', req.body);

	const {
		message
	} = req.body;

	// Reset del timer di inattività ogni volta che riceviamo un nuovo messaggio
	clearTimeout(resetTimeout);
	resetTimeout = setTimeout(resetConversation, 30 * 60 * 1000);

	try {
		conversationHistory.push({
			role: 'user',
			content: message
		});
		limitConversationHistory();

		const thread = await openai.beta.threads.create();
		console.log("Thread creato con ID:", thread.id);

		for (const msg of conversationHistory) {
			await openai.beta.threads.messages.create(thread.id, {
				role: msg.role,
				content: msg.content
			});
		}

		const run = openai.beta.threads.runs.stream(thread.id, {
			assistant_id: ASSISTANT_ID,
			model: MODEL
		});

		let assistantResponse = '';

		run
			.on('textDelta', (textDelta) => {
				assistantResponse += textDelta.value;
			})
			.on('end', () => {
				assistantResponse = removeSources(assistantResponse);
				console.log("Risposta:", assistantResponse);

				conversationHistory.push({
					role: 'assistant',
					content: assistantResponse
				});
				limitConversationHistory();

				res.json({
					response: assistantResponse
				});
			})
			.on('error', (error) => {
				console.error('Errore nello streaming della risposta:', error);
				res.status(500).json({
					error: 'Errore nella comunicazione con l\'Assistant'
				});
			});

	} catch (error) {
		res.status(500).json({
			error: 'Cannot communicate with the TTA Assistant'
		});
	}
});

//console.log('Router configurato correttamente');
module.exports = router; // Esporta solo il router
