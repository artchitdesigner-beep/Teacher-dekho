import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDToTnTJDfoUNg0NVWoTRiQHgP3Dj9ESGI",
    authDomain: "teacher-dekho.firebaseapp.com",
    projectId: "teacher-dekho",
    storageBucket: "teacher-dekho.firebasestorage.app",
    messagingSenderId: "1015261758456",
    appId: "1:1015261758456:web:c1ef95dfdfe6e65ee58c0d",
    measurementId: "G-QSDXNDWHGJ"
};

console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : undefined, // Hide API key in logs
});

// Validate config
const requiredKeys = Object.keys(firebaseConfig).filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
if (requiredKeys.length > 0) {
    console.error('Missing Firebase configuration keys:', requiredKeys);
    console.warn('Firebase features will not work until you set up your .env file.');
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
    }
} catch (error) {
    console.error('Firebase initialization failed:', error);
}

export { auth, db, analytics };
