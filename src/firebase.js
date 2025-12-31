import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";

import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use initializeFirestore to configure polling properly
const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: {
        kind: 'persistent'
    }
});
// FORCE reference to prevent lazy init bugs
const _forceInit = db.app;

// attempt persistence the legacy way just in case (optional, wrapped safely)
try {
    enableIndexedDbPersistence(db, { forceOwnership: false }).catch(() => { });
} catch (e) { }

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
