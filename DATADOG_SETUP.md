# Datadog Integration for Serverless AI App

This guide explains how to complete the observability setup for your serverless LLM application powered by Gemini.

## 1. Prerequisites

Ensure you have set the following environment variables in your Netlify or deployment environment:
- `DD_API_KEY`: Your Datadog API Key
- `DD_SITE`: e.g., `datadoghq.com` (or `us5.datadoghq.com`)
- `GEMINI_API_KEY`: Your Google Gemini API Key
- `REACT_APP_DD_APPLICATION_ID`: Datadog RUM Application ID
- `REACT_APP_DD_CLIENT_TOKEN`: Datadog RUM Client Token

## 2. LLM Telemetry & Tracing

We have instrumented the Netlify Function (`gemini.js`) using `dd-trace` and `datadog-lambda-js`.
- **Traces**: Every call to the `gemini` function generates a trace.
- **Custom Spans**: We created a custom span `gemini.generate_content` that tracks the model, prompt (metadata), and response length.
- **RUM**: The frontend captures user interactions and links them to backend traces via distributed tracing headers.

## 3. Recommended Dashboard

You can create a "Serverless AI Observability" dashboard in Datadog.

### Key Widgets to Add:
1.  **Total AI Requests**: Timeseries graph of `trace.gemini.handler.hits`.
2.  **Latency Distribution**: Distribution graph of `trace.gemini.generate_content.duration`.
3.  **Error Rate**: Timeseries graph of `trace.gemini.handler.errors`.
4.  **Response Length**: Average of `llm.response_length` (custom metric from tag).
5.  **Recent Prompts**: Log stream filtering for `service:kiroween-bulletin-api` and `llm.prompt`.

### Detection Rules & Alerts

To implement the request for **End-to-End Observability** and **Actionable Items**:

#### A. Define Detection Rules (Monitors)
Create the following monitors in Datadog (Monitors -> New Monitor):

1.  **High Error Rate**:
    *   **Query**: `sum(last_5m):sum:trace.gemini.handler.errors{service:kiroween-bulletin-api}.as_count() > 5`
    *   **Message**: "High failure rate detected in Gemini AI Service."

2.  **High Latency (Timeout Risk)**:
    *   **Query**: `p95:trace.gemini.generate_content.duration{service:kiroween-bulletin-api} > 9000` (9 seconds)
    *   **Message**: "AI generation is taking too long."

3.  **Sensitive Content Detected** (Advanced):
    *   *Requires configuring PII scrubbing or custom logic in the function to tag 'sensitive'.*

#### B. Actionable Items (Case Management)
Configure the Monitor's "Notify your team" section to trigger actionable workflows:
1.  **Datadog Incident**: In the monitor message, add `@webhook-pagerduty` or use Datadog Incident Management (`@incident-creating-service`).
2.  **Jira/Slack**: Connect Datadog to Jira/Slack to automatically create a ticket when the Alert fires.

## 4. Testing the Integration

1.  Run the app: `npm start`.
2.  Go to the "Winter Feed" (Home).
3.  Use the **"Ask the Christmas Elf"** section.
4.  Type a prompt and click **Ask**.
5.  Visit Datadog > **APM** > **Traces** to see the `gemini.handler` trace.
6.  Visit Datadog > **RUM** to see the user session.

## 5. Serverless Considerations

This setup uses `datadog-lambda-js` which is optimized for serverless.
- **Cold Starts**: Datadog visualizes cold starts in the trace view.
- **Cost**: Be mindful of trace volume; you can adjust sampling rates in `gemini.js` if needed.

## Dashboard JSON Import
(Save this as `dashboard.json` and import in Datadog)
```json
{
  "title": "Gemini AI App Health",
  "widgets": [
    {
      "definition": {
        "title": "AI Requests per Second",
        "type": "timeseries",
        "requests": [
          { "q": "sum:trace.gemini.handler.hits{service:kiroween-bulletin-api}.as_count()" }
        ]
      }
    },
    {
      "definition": {
        "title": "Average Response Time",
        "type": "query_value",
        "requests": [
          { "q": "avg:trace.gemini.generate_content.duration{service:kiroween-bulletin-api}" }
        ]
      }
    }
  ]
}
```
