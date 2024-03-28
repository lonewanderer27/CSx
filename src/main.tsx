import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FirebaseAppProvider } from 'reactfire';
import firebaseApp from './firebaseApp';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseApp={firebaseApp}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>
);