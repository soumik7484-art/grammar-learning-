const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Groq = require('groq-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        console.log('Received message from client');
        try {
            const parsed = JSON.parse(message);
            console.log('Parsed message type:', parsed.type);
            
            const { type, image, query } = parsed;

            if (type === 'analyze') {
                console.log('Starting AI analysis...');
                const base64Data = image.split(',')[1];

                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: query || "Analyze this screen content. Return a structured JSON response with these keys: objects (list of things seen), detected_text (all visible text), summary (1-sentence overview), and suggestions (3 quick actions)."
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:image/jpeg;base64,${base64Data}`
                                    }
                                }
                            ]
                        }
                    ],
                    model: "llama-3.2-11b-vision-preview",
                    temperature: 0.1,
                    response_format: { type: "json_object" }
                });

                const result = JSON.parse(completion.choices[0].message.content);
                ws.send(JSON.stringify({ type: 'result', data: result }));
            }
        } catch (err) {
            console.error('Processing error:', err);
            ws.send(JSON.stringify({ type: 'error', message: err.message }));
        }
    });

    ws.on('close', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
