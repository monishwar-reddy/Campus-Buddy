# Datadog Observability Integration

## Overview
For the **Datadog Challenge**, we utilized **Datadog Real User Monitoring (RUM)** to build a "Glass Box" observability layer around our AI features. Instead of treating the LLM (Google Gemini) as a black box, we stream real-time telemetry from the client side to visualize the AI's performance, security, and reliability.

## Strategy: "Watching the Brain"
We instrumented our core AI service (`callGemini`) with **Datadog Custom Actions**. This allows us to correlate standard user sessions with specific backend AI behaviors, providing a unified view of the application health.

### 1. Telemetry Architecture
*   **Source**: Frontend (React) via `@datadog/browser-rum` SDK.
*   **Transport**: Custom user actions sent asynchronously during the AI lifecycle.
*   **Context**: All events are tagged with the specific AI feature used (e.g., `feature: smart-post`, `feature: chatbot`).

### 2. Key Metrics Tracked

We defined four critical signals to monitor the AI's pulse:

| Signal | Metric Name | Purpose |
| :--- | :--- | :--- |
| **Start** | `ai_request_start` | Tracks user intent. Helps calculate conversion/drop-off rates. |
| **Performance** | `ai_request_success` | Logs **Latency** (ms) and **Token Count**. Detects hallucinations (high token/latency) or API lag. |
| **Security** | `ai_security_flagged` | **Critical Security Signal**. Triggered when Gemini's safety filters block toxic content. Allows for proactive community moderation. |
| **Reliability** | `ai_request_failed` | Tracks API errors (e.g., 429 Rate Limits, 500 Server Errors). Used for uptime monitoring. |

## Dashboard & Alerts

Our Datadog RUM Dashboard visualizes these signals to answer three questions:

1.  **Is it Safe?** (Toxicity Radar showing `ai_security_flagged` spikes)
2.  **Is it Fast?** (Latency heatmaps for `ai_request_success`)
3.  **Is it Working?** (Error rate monitoring via `ai_request_failed`)

## Code Implementation
See `src/utils/datadog.js` for the initialization logic and `src/utils/gemini.js` for the event instrumentation hooks.
