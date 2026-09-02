import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './main.scss';

function start(): void {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('The React mount element is missing.');
  createRoot(rootElement).render(<StrictMode><App /></StrictMode>);
}

start();
