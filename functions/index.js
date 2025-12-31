// Datadog Tracer Init - Must be first
require('dd-trace').init({
    logInjection: true,
    runtimeMetrics: true,
    service: 'kiroween-bulletin-functions',
    env: process.env.DD_ENV || 'production'
});

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.gemini = functions.https.onRequest((req, res) => {
    // 1. Trace the request
    return cors(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                return res.status(405).send({ error: 'Method Not Allowed' });
            }

            const { prompt } = req.body;
            if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

            const apiKey = process.env.GEMINI_API_KEY;
            // Note: In Cloud Functions, env vars are set via `firebase functions:config:set` 
            // or use standard process.env if using the new secrets manager or .env support (v2).
            // For now, assuming process.env works or user sets it up.

            if (!apiKey) {
                console.error("GEMINI_API_KEY not found");
                return res.status(500).send({ error: 'Server configuration error' });
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return res.status(200).send({ text });

        } catch (error) {
            console.error("Error calling Gemini:", error);
            return res.status(500).send({ error: error.message });
        }
    });
});
