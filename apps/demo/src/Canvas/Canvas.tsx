import type { FC } from "react";
import classNames from "classnames";
import { Container } from "../components";
import type { ClipperPolygons, ClippingResult, FillType } from "../features/clipping";
import type { PolygonSelection } from "../types";
import styles from "./Canvas.module.scss";

type CanvasProps = {
  className?: string;
  result: ClippingResult | null;
  scale: number;
  subjectFillType: FillType;
  clipFillType: FillType;
  bevel: boolean;
  selection: PolygonSelection | null;
};

export const polygonsToSvgPath = (polygons: ClipperPolygons, scale: number): string =>
  polygons.map((polygon) => polygon.length === 0 ? "" : `${polygon.map(({ X, Y }, index) =>
    `${index === 0 ? "M" : "L"}${X / scale},${Y / scale}`).join("")}Z`).join("");

const polygonsForSelection = (
  result: ClippingResult,
  selection: PolygonSelection,
): ClipperPolygons => {
  if (selection.polygonId === "total")
    return [...result.subject, ...result.clip, ...result.solution];

  const polygons = result[selection.polygonId];
  if (selection.polygonIndex === null) return polygons;

  const polygon = polygons[selection.polygonIndex];
  return polygon ? [polygon] : [];
};

export const createSvgMarkup = (
  result: ClippingResult,
  scale: number,
  subjectFillType: FillType,
  clipFillType: FillType,
  bevel = false,
  selection: PolygonSelection | null = null,
): string => [
  '<svg id="p" width="500" height="350" viewBox="0 0 500 350" role="img" aria-label="Polygon result">',
  bevel ? '<defs><filter id="innerbevel"><feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" /><feComposite in="SourceAlpha" in2="blur" operator="arithmetic" k2="-1" k3="1" result="bevel" /><feComposite in="SourceGraphic" in2="bevel" operator="over" /></filter></defs>' : "",
  `<path id="p1" d="${polygonsToSvgPath(result.subject, scale)}" fill-rule="${subjectFillType === "evenOdd" ? "evenodd" : "nonzero"}" />`,
  `<path id="p2" d="${polygonsToSvgPath(result.clip, scale)}" fill-rule="${clipFillType === "evenOdd" ? "evenodd" : "nonzero"}" />`,
  `<path id="p3" d="${polygonsToSvgPath(result.solution, scale)}"${bevel ? ' filter="url(#innerbevel)"' : ""} />`,
  selection
    ? `<path class="highlightedPath" d="${polygonsToSvgPath(polygonsForSelection(result, selection), scale)}" fill="#000" fill-opacity="0.3" stroke="#000" stroke-width="1.5" pointer-events="none" />`
    : "",
  "</svg>",
].join("");

const Canvas: FC<CanvasProps> = ({ className, result, scale, subjectFillType, clipFillType, bevel, selection }) => (
  <Container className={classNames(styles.root, className)}>
    {result ? (
      <div className={styles.svg} dangerouslySetInnerHTML={{
        __html: createSvgMarkup(result, scale, subjectFillType, clipFillType, bevel, selection),
      }} />
    ) : <p className={styles.empty}>Preparing polygons…</p>}
  </Container>
);

export default Canvas;
