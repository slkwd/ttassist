# ttassist
 The Traditional Tune Archive Companion
 
 I created this project because I needed to interface with the assistant I created on the [OpenAI Assistant platform](https://platform.openai.com/assistants).
 I looked everywhere without finding anything that suited me with the exception of sites that host your **assistantID** for a fee and give you in return four HTML instructions to embed on your site.

 So I asked ChatGPT to create this application for me and he/she did.

 It works--and well!

 The name of the project is The Traditional Tune Archive's Companion because I have taught my Assistant everything there is to know about [The Traditional Tune Archive](https://tunearch.org) (my semantic web dedicated to the traditional music of the British Isles, Ireland, Scotland, North America and Canada) however, I believe it is generic enough to be used by anyone who needs to interface with their pre-trained Assistant.
 
 The architecture consists of a frontend where index.html with the style.css file and icons resides and a backend where the node server (server.js) runs with the application (app.js) that responds in https on port 8443 - (I use LetsEncrypt at backend)
 
 
 # Installation
 
  Clone my repo: git clone https://github.com/slkwd/ttassist.git
  
  Change _YOURBACKEND.ORG_ in server.js at
  
  	const privateKey = fs.readFileSync('/etc/letsencrypt/live/_YOURBACKEND.ORG_/privkey.pem', 'utf8');
  
  	const certificate = fs.readFileSync('/etc/letsencrypt/live/_YOURBACKEND.ORG_/fullchain.pem', 'utf8');
	
	console.log(`Server HTTPS in esecuzione su https://_YOURBACKEND.ORG_:${PORT}`);
  
  
  change _yourdomain.org_ in index.html at
  
  	const response = await fetch('https://_yourdomain.org_:8443/api/ask'
  
  and if you want 
  
  change the name of your assistant in index.html between <title> tag </title>
  
  	<title>assistant:the Name of your Assistant here</title>
  
  
  __npm install__
  
 # Run
  
  __node server.js__
  
  