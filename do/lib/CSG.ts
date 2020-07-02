import { build, clipTo, invert, allPolygons, fromPolygons } from './bspNode';
import { Polygon, flipPolygon } from './polygon2';

export const union = (
  a: readonly Polygon[],
  b: readonly Polygon[]
): readonly Polygon[] => {
  const bspA = fromPolygons(a);
  const bspB = fromPolygons(b);
  const clippedA = clipTo(bspA, bspB);
  const clippedB = invert(clipTo(invert(clipTo(bspB, clippedA)), clippedA));
  return allPolygons(build(allPolygons(clippedB), clippedA));
};

export const subtract = (
  a: readonly Polygon[],
  b: readonly Polygon[]
): readonly Polygon[] => {
  const bspA = fromPolygons(a);
  const bspB = fromPolygons(b);
  const clippedA = clipTo(invert(bspA), bspB);
  const clippedB = invert(clipTo(invert(clipTo(bspB, clippedA)), clippedA));
  return allPolygons(invert(build(allPolygons(clippedB), clippedA)));
};

export const subtract1 = (
  a: readonly Polygon[],
  b: readonly Polygon[]
) => {
  const bspA = fromPolygons(a);
  const bspB = fromPolygons(b);
  const clippedA = clipTo(invert(bspA), bspB);
  const clippedB = clipTo(bspB, clippedA);
  return allPolygons(clippedB);
  // return allPolygons(invert(build(allPolygons(clippedB), clippedA)));
};


export const inverse = (a: readonly Polygon[]) => a.map(flipPolygon);
