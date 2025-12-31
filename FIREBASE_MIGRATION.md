# Firebase Migration Guide

To switch from Supabase to Firebase, please follow these steps:

## 1. Firebase Project Setup
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project (e.g., `kiroween-bulletin`).
3.  **Authentication**: Enable **Google Sign-In** in the Auth section.
4.  **Firestore**: Create a database (Start in **Test Mode** for now).
5.  **Functions**: Upgrade to **Blaze Plan** (Pay-as-you-go) to use Cloud Functions (required for Gemini + Datadog).
6.  **Apps**: Add a **Web App** to get your generic configuration.

## 2. Environment Variables (.env)
Update your `.env` file with the Firebase keys from your Project Settings:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...

# Datadog & Gemini (Keep these)
REACT_APP_DD_APPLICATION_ID=...
REACT_APP_DD_CLIENT_TOKEN=...
GEMINI_API_KEY=...
```

## 3. Serverless Functions Deployment
To deploy the new `gemini` function to Firebase:

1.  Install tools: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Initialize: `firebase init functions` (select existing project).
    *   *Note: I have already created the code in `functions/`, so just overwrite if asked or ensure `index.js` is preserved.*
4.  Deploy: `firebase deploy --only functions`

## 4. Hosting Deployment
To deploy your React app to Firebase Hosting:

1.  Build the app: `npm run build`
2.  Deploy: `firebase deploy --only hosting`

## 5. Notes on Migration
*   **Supabase** dependencies are still installed but unused in the main flows. You can remove them later.
*   **Storage** (Avatar Upload) is currently disabled/mocked in `UserContext.js` until you enable Firebase Storage.
