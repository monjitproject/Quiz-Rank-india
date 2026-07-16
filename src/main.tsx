import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register or unregister Service Worker depending on environment
if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    // Unregister any active service workers in development to prevent stale caching issues
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('[Service Worker] Unregistered active worker in development mode.');
          }
        });
      }
    });
  } else {
    // Register Service Worker for offline access in production only
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[Service Worker] Registered successfully with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[Service Worker] Registration failed:', err);
        });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

