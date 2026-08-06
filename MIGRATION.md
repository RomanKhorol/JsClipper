# Demo Migration Plan

## Goal

Migrate the existing static HTML/JavaScript demo to a React application
without changing the behavior of the JSClipper library or losing existing
demo functionality.

Localization and responsive-layout work are intentionally deferred until
the React migration reaches functional parity.

## Current implementation

- `apps/demo/demo.html` contains the complete page markup.
- `apps/demo/demo.js` contains UI state, event handlers, rendering, polygon
  operations, benchmarks, import/export behavior, and DOM manipulation.
- `apps/demo/formatter.js` provides output-formatting helpers.
- `apps/demo/demo.css` contains the existing presentation rules.
- `apps/demo/vendor/` contains browser-oriented legacy dependencies.
- `packages/js-clipper/clipper.js` exposes the clipping implementation.
- Raphael, jQuery, and Lodash are currently loaded through global scripts.

## Migration principles

1. Preserve existing behavior before redesigning it.
2. Keep JSClipper independent from React.
3. Move application code into `apps/demo/src/`.
4. Replace direct DOM manipulation incrementally.
5. Do not introduce jQuery into the React application.
6. Remove jQuery and its plugins before functional parity is approved.
7. Keep each migration stage reviewable and reversible.
8. Add tests around existing behavior before splitting large legacy modules.
9. Defer localization and responsive redesign until parity is confirmed.
10. Write all new React application code in TypeScript and use JavaScript only
    for legacy files that have not yet been migrated.

## React TypeScript requirements

The React application in `apps/demo` must use TypeScript. Migrated React
components, hooks, adapters, and utilities must not be added as `.js` or
`.jsx` files.

1. Use `.tsx` for files that contain JSX and `.ts` for all other TypeScript
   source files.
2. Add `apps/demo/tsconfig.json` with strict type checking enabled and Vite's
   recommended React configuration.
3. Add `apps/demo/src/vite-env.d.ts` for Vite client types.
4. Configure ESLint to check TypeScript and React source files.
5. Add a `typecheck` script that runs `tsc --noEmit` and expose it through
   Turbo at the repository root.
6. Type component props, application state, hook results, adapter boundaries,
   imported polygon data, and exported polygon data explicitly.
7. Prefer `unknown` at untrusted boundaries and narrow it before use; do not
   use `any` to bypass migration work without documenting the reason.
8. Add declarations or typed adapters for legacy browser dependencies that
   remain temporarily available during the migration.
9. Import types from workspace packages through their public entry points.
10. Do not convert untouched legacy scripts solely to satisfy the React
    TypeScript configuration; exclude them until their migration phase.

## jQuery removal strategy

The React application must not depend on jQuery.

1. Replace jQuery DOM updates with React rendering and state.
2. Replace jQuery event registration with React event handlers and hooks.
3. Replace `jquery.repeated-click.js` with a focused React hook.
4. Replace `jquery.total-storage.js` with a `localStorage` adapter.
5. Replace class and visibility manipulation with conditional JSX.
6. Remove the jQuery CDN script only after no migrated feature uses `$`.
7. Remove both jQuery vendor plugins after their replacements are verified.
8. Confirm that the production build contains no jQuery dependency.

## RGBColor TypeScript package migration

Move the legacy global `RGBColor` implementation into a modern TypeScript
workspace package named `@js-clipper/rgb-color`.

### Target structure

```text
packages/rgb-color/
├── src/
│   ├── namedColors.ts
│   ├── RgbColor.ts
│   └── index.ts
├── test/
│   └── RgbColor.test.ts
├── package.json
└── tsconfig.json
```

### Requirements

1. Implement `RgbColor` as an exported TypeScript class.
2. Keep the package independent from React, jQuery, and the DOM.
3. Preserve the existing `ok`, `r`, `g`, and `b` properties.
4. Preserve `toRGB()`, `toHex()`, and `flattenRGBA()` behavior.
5. Preserve named-color, `rgb()`, three-digit HEX, and six-digit HEX parsing.
6. Move the named-color map into a typed `namedColors.ts` module.
7. Remove accidental global variables and use strict module scope.
8. Generate JavaScript and TypeScript declarations in `dist/`.
9. Add TypeScript tests for valid, invalid, clamped, named, HEX, and RGB input.
10. Add tests for alpha flattening against a background color.
11. Export the public API through `src/index.ts`.
12. Import the package as `@js-clipper/rgb-color` in the React application.
13. Remove `apps/demo/vendor/rgb-color.js` only after the new package passes
    its tests and the migrated demo no longer uses global `RGBColor`.

## Phase 1: Establish the React application

1. Configure `apps/demo` as a React and TypeScript application using Vite.
2. Add Sass support and use SCSS for application and component styles.
3. Add `src/main.tsx` as the browser entry point.
4. Add `src/App.tsx` as the initial application component.
5. Move the existing CSS unchanged into `src/styles/main.scss`.
6. Keep the current vendor assets available during migration.
7. Render the existing interface through React without redesigning it.
8. Confirm that the app can import `js-clipper` from the workspace package.
9. Add strict TypeScript configuration and a `typecheck` script.

### Exit criteria

- The React development server starts through Turbo.
- The existing demo layout renders.
- JSClipper can be imported from the library workspace.
- `npm run typecheck` succeeds from the repository root.
- The React application contains no new `.js` or `.jsx` source files.
- No existing source file is removed until its replacement is verified.

## Phase 2: Preserve and isolate legacy behavior

1. Inventory all controls and event handlers in `demo.js`.
2. Identify mutable global state and group it by feature.
3. Extract pure calculations and formatting helpers into `src/utils/`.
4. Wrap unavoidable legacy integrations behind small adapter modules.
5. Add smoke tests for clipping, formatting, and representative demo actions.

### Suggested source structure

```text
apps/demo/src/
├── main.tsx
├── App.tsx
├── components/
├── features/
├── hooks/
├── adapters/
├── utils/
└── styles/
    ├── _variables.scss
    ├── _mixins.scss
    └── main.scss
```

This is a target structure, not a requirement to create every directory
before it contains real code.

## Phase 3: Convert the interface by feature

Migrate one feature at a time:

1. Subject and clip polygon inputs.
2. Boolean-operation controls.
3. Offset, clean, simplify, and lighten controls.
4. Canvas/SVG visualization.
5. Polygon explorer and statistics.
6. Import and export formats.
7. Custom polygon editing.
8. Benchmark controls.
9. Saved settings and browser storage.

For each feature:

1. Document the current behavior.
2. Add a focused test where practical.
3. Implement the React version.
4. Compare it with the legacy demo.
5. Remove the replaced legacy code only after approval.

## Phase 4: Remove legacy runtime dependencies

1. Replace jQuery event handling with React handlers.
2. Replace jQuery storage helpers with a small storage adapter.
3. Replace repeated-click behavior with a React hook.
4. Replace global Lodash usage with native JavaScript or focused imports.
5. Evaluate whether Raphael should be wrapped, replaced, or retained.
6. Remove each script dependency only after confirming it is unused.

## Phase 5: Functional-parity review

Verify:

- All clipping operations produce equivalent results.
- Visualization and polygon exploration still work.
- Import/export formats remain compatible.
- Custom polygons and saved settings still work.
- Benchmarks remain available.
- The browser console has no unexpected errors.
- The legacy demo is no longer required at runtime.

## Phase 6: Localization

Begin only after functional parity:

1. Extract user-visible strings from components.
2. Define stable translation keys.
3. Add an internationalization library and locale loader.
4. Add the initial supported locales.
5. Persist the selected locale.
6. Test missing translations and fallback behavior.

## Phase 7: Responsive and multi-resolution layout

Begin after localization:

1. Define supported viewport ranges.
2. Replace fixed-width layout assumptions.
3. Make controls usable with touch input.
4. Make visualization dimensions responsive.
5. Test text expansion caused by translations.
6. Verify representative mobile, tablet, laptop, and large-screen sizes.

## Validation commands

Commands will be finalized as the relevant scripts are added. The intended
workflow is:

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Each command must work from the repository root through Turbo before the
migration is considered complete.

## Execution rule

This document is a plan only. Implementation starts after the plan has been
reviewed and explicitly approved. Material deviations from the approved plan
must be reviewed before they are applied.
