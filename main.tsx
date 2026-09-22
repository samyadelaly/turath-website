import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './ErrorBoundary';
import './index.css';

// Client-side auto-cache purge: Checks version timestamp and purges old browser caches
try {
  const BUILD_VERSION = '2026.09.21.v2';
  const savedVersion = localStorage.getItem('turath_build_version');
  if (savedVersion !== BUILD_VERSION) {
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      }).catch(() => {});
    }
    localStorage.setItem('turath_build_version', BUILD_VERSION);
  }
} catch {
  // Ignore storage restrictions
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
