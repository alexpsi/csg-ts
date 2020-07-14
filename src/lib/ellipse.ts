import { createPolygon, Polygon } from './polygon';

export const createEllipse = (
  cx = 0,
  cy = 0,
  rx = 1,
  ry = 1,
  segments = 16
): readonly Polygon[] => {
  const step = (2 * Math.PI) / segments;
  return [
    createPolygon(
      Array(segments)
        .fill(0)
        .map((__, idx) => ({
          x: 2 * rx * Math.cos(step * idx) + cx,
          y: 2 * ry * Math.sin(step * idx) + cy,
          z: 0
        }))
    )
  ];
};
