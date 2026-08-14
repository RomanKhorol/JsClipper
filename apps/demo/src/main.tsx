import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ClipperLib from 'js-clipper';

import legacyDocument from '../demo.html?raw';
import demoUrl from './demo.js?url';
import formatterUrl from './formatter.js?url';
import lodashMathUrl from '../vendor/lodash.math.js?url';
import repeatedClickUrl from '../vendor/jquery.repeated-click.js?url';
import storageUrl from '../vendor/jquery.total-storage.js?url';
import rgbColorUrl from '../vendor/rgb-color.js?url';
import { App } from './App';
import './main.scss';

declare global { interface Window { ClipperLib?: unknown; } }

const bodyMatch = legacyDocument.match(/<body[^>]*>([\s\S]*?)<script src="src\/demo\.js"><\/script>[\s\S]*?<\/body>/i);
if (!bodyMatch?.[1]) throw new Error('Unable to load the legacy demo markup.');
const legacyMarkup = bodyMatch[1];

function load(source: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load legacy script: ${source}`));
    document.head.append(script);
  });
}

async function start(): Promise<void> {
  const legacyHost = document.getElementById('legacy-page');
  const rootElement = document.getElementById('root');
  if (!legacyHost || !rootElement) throw new Error('The legacy or React mount element is missing.');
  createRoot(rootElement).render(<StrictMode><App /></StrictMode>);
  legacyHost.innerHTML = legacyMarkup;
  window.ClipperLib ??= ClipperLib;
  await [lodashMathUrl, rgbColorUrl, repeatedClickUrl, storageUrl, formatterUrl, demoUrl]
    .reduce<Promise<void>>((pending, source) => pending.then(() => load(source)), Promise.resolve());
}

void start().catch(console.error);
