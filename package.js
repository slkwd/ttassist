{
  "name": "user-interface-to-openai-assistant",
  "version": "1.0.0",
  "description": "Node.js server per interagire con OpenAI",
  "main": "server.js",
  "author": "Valerio Pelliccioni",
  "email": "vmp@tunearch.org",	
  "url": "https://tunearch.org",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "openai": "^3.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.3.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.19"
  }
}