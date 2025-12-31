const { datadog } = require('datadog-lambda-js');
const tracer = require('dd-trace').init({
    logInjection: true,
    runtimeMetrics: true
});
const { GoogleGenerativeAI } = require("@google/generative-ai");

const handler = async (event, context) => {
    // Add CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Start a custom span for the LLM logic
    // Note: datadog() wrapper handles the root function span

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY env var not set");
        }

        const body = JSON.parse(event.body || '{}');
        const prompt = body.prompt || "Hello, world!";

        // Manually instrument the Gemini call
        // Datadog currently has auto-instrumentation for OpenAI, but manual for others is safer for generic usage
        const result = await tracer.trace('gemini.generate_content', {
            resource: 'gemini-1.5-flash', // or whatever model you use
            type: 'llm',
            tags: {
                'llm.provider': 'vertex-ai-gemini',
                'llm.model': 'gemini-1.5-flash',
                'llm.prompt': prompt // Be careful with PII here
            }
        }, async (span) => {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Add response length or other metadata
            span.setTag('llm.response_length', text.length);

            return text;
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ text: result }),
        };

    } catch (error) {
        console.error("Error generating content:", error);

        // The wrapper usually catches errors, but we return 500 explicitly
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// Wrap the handler with datadog
exports.handler = datadog(handler);
