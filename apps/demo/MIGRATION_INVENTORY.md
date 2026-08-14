# Legacy demo inventory

This inventory records the current behavior before it is moved from
`src/demo.js` into typed React features.

## Mutable legacy state

| State group | Variables | Responsibility |
| --- | --- | --- |
| Polygon selection | `selectedPolygons`, `subj`, `clip`, `solution` | Active built-in/custom/random inputs and polygon counts. |
| Boolean geometry | `clipType`, fill types, `clean`, `simplify`, `lighten` | Clipping and geometry-processing options. |
| Offsetting/scaling | `offsettablePoly`, `joinType`, `delta`, `miterLimit`, `autoFix`, `scale` | Offset calculation and coordinate scaling. |
| Visualization | `SVG`, `p`, `bevel`, `explorerEnabled`, output/view flags | Raphael paths, explorer state, and generated SVG output. |
| Custom data | browser `custom_polygons` storage | Saved subject/clip text pairs; index zero is immutable default data. |
| Benchmarking | `bench`, `benchmarkRunning`, `benchmarkGlob`, exports | Running status, repeated runs, and benchmark output. |

## Phase 2 boundaries

- `src/utils/polygonFormat.ts`: typed formatting for Clipper, plain, and SVG output.
- `src/adapters/localStorage.ts`: typed JSON access for browser storage.
- `src/features/customPolygons/storage.ts`: typed saved-polygon lifecycle.
- `src/adapters/legacyDemo.ts`: temporary typed boundary for remaining legacy behavior.
- `src/adapters/svgRenderer.ts`: React-facing adapter for the retained Raphael renderer.
- Unit and DOM tests cover formatting, storage lifecycle, legacy markup/handler presence,
  built-in selection, and custom polygon save/load/delete/reset flows.

| Feature | Legacy controls | Current owner |
| --- | --- | --- |
| Built-in polygon sets | `polygons` radio group | `selectedPolygons`, `getPolygons()` |
| Custom polygon sets | selects, textareas, save/delete actions | `getCustomPolygons()`, `saveCustomPolygon()` |
| Random polygons | count inputs and `New` action | `randomSetting`, `getRandomPolygons()` |
| Boolean clipping | fill type and clip type radios | `subj`, `clip`, `clipType`, `makeClip()` |
| Geometry transforms | clean, simplify, lighten, offset, scale controls | `makeClip()` |
| SVG and explorer | SVG source, enlarge, explorer controls | `SVG`, `updateEnlargedSVGSource()` |
| Benchmarks | four benchmark buttons | `benchmark*`, `benchmark2()` |

## Migration order

1. Typed polygon formatting and local storage adapters. Completed.
2. Built-in polygon selection. Completed in React; selection is bridged to the legacy clipping engine.
3. Custom polygon inputs and saved polygon management. The typed storage model is complete; UI wiring is next.
4. Random polygon selection and clipping controls. The React press-and-hold replacement is available; control wiring is next.
5. SVG visualization, explorer, import/export, and benchmarks.

## Phase 2 completion

Phase 2 is complete. The legacy behavior is inventoried, pure formatting and
storage logic have typed boundaries, unavoidable browser integrations are
isolated behind adapters, and representative smoke/interaction tests are in
place. Phase 3 proceeds feature-by-feature, retaining the legacy UI for each
feature until its React replacement reaches parity.

The legacy script remains the runtime owner until a feature and its tests are
fully replaced.
