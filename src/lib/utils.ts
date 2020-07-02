import { createPolygon, flipPolygon, Polygon } from './polygon';
import { transform, translate } from './transforms';

// Single level flatten
export const flatten = (x: ReadonlyArray<readonly any[]>): readonly any[] =>
  x.reduce((acc, y) => acc.concat(y), []);


export const skin = (polygonA: Polygon, polygonB: Polygon): readonly Polygon[] => 
  polygonA.vectors.reduce((acc, __, idx) => {
    const nextIdx = (idx + 1) % polygonA.vectors.length; // Cyclical next
    return [...acc, createPolygon([
      polygonB.vectors[idx],
      polygonB.vectors[nextIdx],
      polygonA.vectors[nextIdx],
      polygonA.vectors[idx],
    ])]
}, [] as readonly Polygon[])



export const simpleExtrude = (polygon: Polygon, height: number): readonly Polygon[] => {
  const top = flipPolygon(polygon);
  const bottom = transform([polygon], translate(0, 0, height))[0];
  const walls = top.vectors.reduce((acc, __, idx) => {
    const nextIdx = (idx + 1) % top.vectors.length; // Cyclical next
    return [...acc, createPolygon([
      [...bottom.vectors].reverse()[idx],
      [...bottom.vectors].reverse()[nextIdx],
      top.vectors[nextIdx],
      top.vectors[idx],
    ])]
  }, [] as readonly Polygon[])
  return [top, ...walls, bottom];
}