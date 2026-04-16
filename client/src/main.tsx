import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * The root element from index.html.
 * We use type assertion (as HTMLElement) because TypeScript doesn't 
 * know for sure if 'root' exists in the HTML at compile time.
 */
const rootElement = document.getElementById('root') as HTMLElement;

if (!rootElement) {
  throw new Error("Failed to find the root element. Make sure index.html has a <div id='root'></div>");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);