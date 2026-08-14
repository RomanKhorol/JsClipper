/// <reference types="vite/client" />

declare module 'js-clipper' {
  const ClipperLib: unknown;
  export default ClipperLib;
}

declare module '*.js?url' {
  const source: string;
  export default source;
}
