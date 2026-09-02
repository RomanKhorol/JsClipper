import ClipperLib from "js-clipper";
import type { ClipperEngine } from "../features/clipping";

type JsClipperEngine = {
  PolyType: ClipperEngine["PolyType"];
  ClipType: {
    ctIntersection: number;
    ctUnion: number;
    ctDifference: number;
    ctXor: number;
  };
  PolyFillType: {
    pftEvenOdd: number;
    pftNonZero: number;
  };
  JoinType: {
    jtSquare: number;
    jtRound: number;
    jtMiter: number;
  };
  Clipper: ClipperEngine["Clipper"];
  Clone: ClipperEngine["Clone"];
  Clean: ClipperEngine["Clean"];
  Lighten: ClipperEngine["Lighten"];
};

const engine = ClipperLib as JsClipperEngine;

export const clipperEngine: ClipperEngine = {
  PolyType: engine.PolyType,
  ClipType: {
    intersect: engine.ClipType.ctIntersection,
    union: engine.ClipType.ctUnion,
    difference: engine.ClipType.ctDifference,
    xor: engine.ClipType.ctXor,
  },
  PolyFillType: { evenOdd: engine.PolyFillType.pftEvenOdd, nonZero: engine.PolyFillType.pftNonZero },
  JoinType: { square: engine.JoinType.jtSquare, round: engine.JoinType.jtRound, miter: engine.JoinType.jtMiter },
  Clipper: engine.Clipper,
  Clone: engine.Clone,
  Clean: engine.Clean,
  Lighten: engine.Lighten,
};
