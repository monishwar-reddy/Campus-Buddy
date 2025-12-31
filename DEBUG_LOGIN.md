# How to Fix "auth/configuration-not-found"

The error you are seeing means that **Google Sign-In is not enabled** in your Firebase project.

### 1. Enable Google Sign-In
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project **campus-connect**.
3.  Click on **Authentication** in the left sidebar (under Build).
4.  Click **Get Started** if you haven't yet.
5.  Go to the **Sign-in method** tab.
6.  Click **Add new provider**.
7.  Select **Google**.
8.  **Toggle "Enable"** (top right switch).
9.  Select a **Project support email** from the dropdown.
10. Click **Save**.

### 2. Check Authorized Domains (If error changes)
If you see a different error later (like `auth/unauthorized-domain`), ensure `localhost` is authorized:
1.  Still in **Authentication** > **Settings** > **Authorized domains**.
2.  Make sure `localhost` is listed.

### 3. Restart App
After enabling it, you might need to refresh your browser page.
