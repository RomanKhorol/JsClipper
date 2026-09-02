JsClipper
=========

A JavaScript library to perform boolean operations (union, difference etc...) between two SVG paths.

Project structure
-----------------

The project is an npm-workspaces monorepo orchestrated with Turborepo.

- `packages/js-clipper` contains the reusable clipping library.
- `apps/demo` contains the interactive browser demo.

The demo has been migrated from the legacy DOM-driven implementation to React 18 and TypeScript. It is built with Vite and uses shared React components, typed application state, localisation, and automated tests.

The old demo, jQuery, and other legacy browser dependencies have been removed. The current UI no longer relies on direct DOM manipulation or the former static demo files.

Development
-----------

Install dependencies and start all development tasks:

```sh
npm install
npm run dev
```

Useful repository-wide checks are `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.

Online demo: https://romankhorol.github.io/JsClipper/

Original : http://sourceforge.net/projects/jsclipper


5.0.2.1 - 12 January 2013
* Update: Clipper library updated to version 5.0.2. The Area algorithm has been updated and is faster.
  'CheckInputs' parameter of the OffsetPolygons function has been renamed 'AutoFix'.
* Added: ClipperLib.Clean(), which removes too near vertices to avoid micro-self-intersection-artifacts when offsetting.
* Added: ClipperLib.Lighten(), which reduces count of vertices using perpendicular distance reduction algorithm.
* Added: ClipperLib.Clone(), which make true clone of polygons.
Several updates to the Main Demo:
* Added: Clean, Simplify, Lighten buttons
* Change: Custom Polygons: input boxes to textareas to allow more data
* Added: Polygon Output Formats (Clipper, Plain, SVG)
* Update: Polygon Explorer: Also multipolygon is clickable (on Points column)
* Added: Polygon Explorer: When numbers on Points or Points in subpolygons are clicked, the area of multipolygon or subpolygon is shown
* Update: Several updates to wiki in https://sourceforge.net/p/jsclipper/wiki/Home/

4.9.7.2 - 1 January 2013
* Update: Browser specific speedup for ClipperLib.Clipper.Round(), ClipperLib.Cast_Int32() and ClipperLib.Cast_Int64().
* Update: Major enhancements for Main Demo. Including benchmark, custom polygons and polygon importer.
* Update: Documentation is updated with new screenshots of Main Demo. Browser speedtest is published in Wiki.

4.9.7.1 - 12 December 2012
* Initial release
