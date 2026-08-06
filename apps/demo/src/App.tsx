import ClipperLib from 'js-clipper';

import legacyDocument from '../demo.html?raw';

declare global {
  interface Window {
    ClipperLib?: unknown;
  }
}

const bodyMatch = legacyDocument.match(/<body[^>]*>([\s\S]*?)<script src="src\/demo\.js"><\/script>[\s\S]*?<\/body>/i);

if (!bodyMatch?.[1]) {
  throw new Error('Unable to load the legacy demo markup.');
}

// This is a temporary compatibility boundary for Phase 1. Feature migrations
// replace sections of this markup with typed React components one at a time.
const legacyMarkup = bodyMatch[1];

export function App(): JSX.Element {
  window.ClipperLib ??= ClipperLib;

  return <main dangerouslySetInnerHTML={{ __html: legacyMarkup }} />;
}
