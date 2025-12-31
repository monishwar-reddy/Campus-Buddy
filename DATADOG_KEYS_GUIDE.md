# What You Need to Bring from Datadog (and Google)

To make the integration work, you need to copy specific keys from your Datadog and Google Cloud accounts into your `.env` file (or Netlify Environment Variables).

## 1. Datadog API Key
**Purpose**: Allows the serverless backend to send traces and metrics to Datadog.
**How to get it**:
1.  Log in to Datadog.
2.  Go to **Organization Settings** (hover over your username in bottom left).
3.  Click **API Keys**.
4.  Click **New Key**, name it `Kiroween API Key`.
5.  Copy the **Key**.
6.  Set as `DD_API_KEY` and `DD_API_KEY_SECRET` (if using secret manager) or just `DD_API_KEY` in `.env`.

## 2. Datadog Client Token & Application ID (RUM)
**Purpose**: Allows the frontend (React) to monitor user sessions and errors.
**How to get it**:
1.  In Datadog, go to **Digital Experience** > **Add an Application**.
2.  Choose **JS**.
3.  Name it `kiroween-bulletin-ui`.
4.  Click **Create New RUM Application**.
5.  You will see a code snippet. Look for these values inside `init()`:
    *   `applicationId`: Copy this UUID. -> Set as `REACT_APP_DD_APPLICATION_ID`
    *   `clientToken`: Copy this token. -> Set as `REACT_APP_DD_CLIENT_TOKEN`

## 3. Datadog Site
**Purpose**: Tells the SDK which Datadog region to send data to.
**How to get it**:
*   Check your URL bar.
    *   If `app.datadoghq.com` -> `datadoghq.com`
    *   If `us5.datadoghq.com` -> `us5.datadoghq.com`
    *   If `app.datadoghq.eu` -> `datadoghq.eu`
*   Set as `DD_SITE` and `REACT_APP_DD_SITE`.

## 4. Google Gemini API Key
**Purpose**: Powers the AI features.
**How to get it**:
1.  Go to AI Studio (https://aistudio.google.com/).
2.  Click **Get API Key**.
3.  Create a key in a customized project.
4.  Set as `GEMINI_API_KEY`.

---

## Final Checklist (.env file)
Create a file named `.env` in the root folder and fill these in:

```bash
# Datadog Backend Keys
DD_API_KEY=your_api_key_here
DD_SITE=datadoghq.com
DD_SERVICE=kiroween-bulletin-api
DD_ENV=production

# Datadog Frontend Keys
REACT_APP_DD_APPLICATION_ID=your_application_id_here
REACT_APP_DD_CLIENT_TOKEN=your_client_token_here
REACT_APP_DD_SITE=datadoghq.com
REACT_APP_DD_SERVICE=kiroween-bulletin-ui
REACT_APP_DD_ENV=production

# AI Keys
GEMINI_API_KEY=your_gemini_key_here
```
