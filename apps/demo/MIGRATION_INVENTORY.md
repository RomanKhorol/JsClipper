# Demo migration plan

## Goal and strategy

Move the demo from the legacy DOM-driven implementation in `src/demo.js` to
typed React modules without rewriting the clipping engine or changing user
visible behaviour. The existing React UI is the target application structure:
it already supplies the layout, controls, styles, translations, and modal
shells. Migration work must now make each UI module own its data and behaviour,
then remove only the legacy markup and handlers that module replaced.

The migration is incremental. A module is complete only when its React version
is the runtime owner, its legacy bridge and duplicated markup are removed, and
its automated checks pass. Do not replace all legacy DOM at once.

## Current architecture

| Area | Current React owner | Legacy runtime owner | Migration state |
| --- | --- | --- | --- |
| Application layout and local UI state | `src/App.tsx` | `src/demo.js` | React shell is in place; most values are not yet applied to clipping. |
| Header | `src/Header` | Language/legacy page chrome | React-owned visually. |
| Left menu | `src/LeftMenu` and shared input components | Polygon, clipping, offset, scale, and SVG option handlers | React controls currently update React state only. |
| Canvas | `src/Canvas` | Raphael SVG creation and update flow | Placeholder React container; legacy renderer remains the source of truth. |
| Right menu | `src/RightMenu` | Benchmark execution and result output | React starts legacy benchmark buttons; result model is temporary. |
| Bottom menu | `src/BottomMenu` | Polygon explorer and output-format update flow | Explorer enablement and format selection bridge to legacy; rows are observed from legacy DOM. |
| SVG dialogs | `src/SvgSourceModal`, `src/EnlargedSvgModal` | SVG source/enlarged SVG content | React visibility exists; content and rendering still need ownership. |
| Polygon data | `src/features`, `src/utils/polygonFormat.ts` | Built-in, random, and custom polygon lifecycle | Formatting and storage boundaries exist; UI and runtime wiring remain. |

## Module boundaries

The following modules must migrate independently. Shared code belongs in
`src/features`, `src/adapters`, `src/hooks`, or `src/components`; menu folders
must not become a second home for clipping or persistence logic.

| Module | React boundary | Owns after migration | Depends on |
| --- | --- | --- | --- |
| Application coordinator | `App.tsx` and a future `features/demo` state/controller boundary | Composing modules, a typed demo state, and one calculation request path | All feature modules |
| Header | `Header` | Title, language selection, and application-level actions | i18n |
| Left menu | `LeftMenu` | Polygon source selection, boolean options, geometry transforms, scale, and view-option commands | Polygon-input and clipping features |
| Polygon input | `features/polygons` | Built-in sets, random settings, custom text input, saved sets, and validation | `localStorage` adapter, Clipper input types |
| Clipping pipeline | `features/clipping` | Building Clipper inputs, executing clip/offset/clean/simplify/lighten, and producing a typed result | `js-clipper`, polygon input |
| Canvas / SVG renderer | `Canvas`, `adapters/svgRenderer.ts` | Rendering the current typed result and highlighting; eventually no direct reads from legacy DOM | Clipping result, view options |
| Bottom menu / explorer | `BottomMenu` | Explorer enablement, output format, typed statistics, and formatted coordinate output | Clipping result, `polygonFormat` |
| Right menu / benchmarks | `RightMenu`, `features/benchmark` | Starting, cancelling, reporting, and exporting benchmark runs | Clipping pipeline |
| SVG dialogs | `SvgSourceModal`, `EnlargedSvgModal` | Showing generated SVG source and enlarged output from React state | Canvas/SVG renderer |
| Shared UI | `components` | Accessible, reusable inputs, tables, buttons, sections, and modal primitives | No feature-specific behaviour |

## Migration sequence

Complete one numbered step at a time. Keep the currently working legacy bridge
only for the module being migrated; do not add new DOM queries as a permanent
interface.

### 1. Establish a typed demo state and result contract

- Define the input, view-option, calculation-result, explorer-row, and
  benchmark-result types in `src/features/demo` (or the nearest focused feature
  module).
- Move the default values currently embedded in `App.tsx` into that module.
- Add a single controller/hook that accepts typed input and returns a typed
  result. Initially it may call a narrow `legacyDemo` adapter.
- Make `App.tsx` compose module props from this controller rather than own
  disconnected UI-only state.

Exit criteria: React has one inspectable state model and no component reads
legacy DOM except through an explicitly named temporary adapter.

### 2. Migrate polygon input and selection

- Move built-in polygon lookup behind a typed polygon-input feature.
- Add React-owned custom polygon text areas, saved-set selection, save/delete,
  reset, and validation. Continue using `adapters/localStorage.ts`.
- Move random polygon settings and generation into the same feature.
- Have `LeftMenu` emit typed commands rather than string IDs where practical.
- Retain the legacy implementation only as a parity oracle while comparing
  generated subject and clip paths.

Exit criteria: selecting built-in, random, or custom data changes React state
and produces typed polygon inputs without legacy select elements or handlers.

### 3. Migrate the clipping and geometry pipeline

- Implement the calculation path for clip type, fill types, clean, simplify,
  lighten, offset, join type, auto-fix, miter limit, delta, and scale.
- Keep each transformation as a small pure function where possible; isolate
  browser-only or legacy dependencies in adapters.
- Connect all relevant `LeftMenu` controls to this pipeline.
- Add unit tests for each option and integration tests for representative
  input/output combinations.

Exit criteria: changing a left-menu calculation option recomputes the React
result and no longer dispatches a legacy DOM event.

### 4. Migrate canvas and SVG rendering

- Replace the `Canvas` placeholder with a renderer driven by the typed result.
- First use `svgRenderer` as an adapter around Raphael if that preserves parity;
  later replace it only if a direct React SVG renderer is justified.
- Move bevel, path highlighting, and viewport behaviour into typed view options.
- Supply SVG markup/source directly to React state for both dialogs.

Exit criteria: the canvas and SVG dialogs render from the React calculation
result, with no observer or lookup of legacy SVG nodes.

### 5. Migrate the bottom menu and polygon explorer

- Derive explorer rows, coordinate text, and output format from the typed
  calculation result.
- Keep the existing virtualized dropdown and its theme styles; remove its
  `output_format` DOM bridge.
- Replace the `MutationObserver` in `App.tsx` with normal React props.
- Define empty, loading, and disabled states for explorer output.

Exit criteria: `BottomMenu` receives typed explorer data and controls no
legacy elements.

### 6. Migrate benchmarks and exports

- Extract benchmark execution, progress, cancellation, timing, and export data
  into `features/benchmark`.
- Update `RightMenu` to invoke that feature instead of clicking hidden legacy
  buttons.
- Render complete benchmark rows from typed results and add failure handling.

Exit criteria: benchmarking works without `benchmark*` legacy controls or DOM
queries.

### 7. Remove legacy UI incrementally

- For each completed module, delete its legacy markup, jQuery bindings, and
  bridge code in the same change set.
- Remove an adapter only after every caller has moved to the React feature.
- When the final module is complete, remove the legacy DOM bootstrap from
  `demo.html` and reduce `src/demo.js` to only retained engine code, or delete
  it if nothing remains.

Exit criteria: the demo renders and behaves entirely from React modules, and
no feature relies on hidden legacy controls.

## Cross-cutting rules

- Preserve `js-clipper` as the geometry engine; migration changes the UI and
  orchestration layer, not its public behaviour.
- Prefer typed props and feature APIs over element IDs, `click()` calls,
  `MutationObserver`, and direct document reads.
- Keep adapters small, explicit, and short-lived. Each adapter must name the
  migration step that removes it.
- Do not mix a visual restyle with a behavioural migration unless the visual
  change is necessary for the migrated module.
- Add tests before removing a legacy path: pure-unit tests for transformations,
  component tests for controls, and end-to-end/smoke coverage for each completed
  module.
- Validate parity with the existing sample polygon sets before declaring a
  clipping, rendering, or benchmark module complete.

## Completion checklist for every module

- [ ] React state and public types are defined.
- [ ] The module has one feature API or hook as its runtime entry point.
- [ ] The UI is driven by typed props rather than legacy DOM reads.
- [ ] Success, empty, disabled, and error states are represented where relevant.
- [ ] Parity tests cover the legacy behaviour being replaced.
- [ ] Legacy markup, handlers, and temporary bridges for this module are removed.
- [ ] The demo type check, lint, tests, and production build pass.
