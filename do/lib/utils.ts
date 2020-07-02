import { Vector } from "./vector";
import { Polygon, createPolygon, flipPolygon } from "./polygon2";

// Single level flatten
export const flatten = (x: ReadonlyArray<readonly any[]>): readonly any[] =>
  x.reduce((acc, y) => acc.concat(y), []);

type Matrix = ReadonlyArray<ReadonlyArray<number>>

export const transpose = (matrix: Matrix): Matrix => 
  Array(matrix[0].length).fill(0).map((__, colId) => matrix.map(row => row[colId]))

export const identityMatrixOf = (n: number) => 
  Array(n).fill(0).map((__, idx) => 
    Array(n).fill(0).map((___, idy) => idx === idy ? 1 : 0)
  )

export const matmul = (matrixA: Matrix, matrixB: Matrix) => 
  new Array(matrixA.length)
    .fill(0).map(__ => new Array(matrixB[0].length).fill(0))
    .map((row, i) => row.map((__, j) => matrixA[i].reduce(
      (sum, elm, k) => sum + (elm * matrixB[k][j]), 0
    )));

export const translate = (tx = 0, ty = 0, tz = 0): Matrix => [
  [ 1,  0,  0,  tx],
  [ 0,  1,  0,  ty],
  [ 0,  0,  1,  tz],
  [0, 0, 0,  1],
];

export const scale = (sx = 0, sy = 0, sz = 0): Matrix => [
  [sx,  0,  0,  0],
  [ 0, sy,  0,  0],
  [ 0,  0, sz,  0],
  [ 0,  0,  0,  1],
];

export const rotateX = (theta: number): Matrix => [
  [ 1,  0,                              0,  0 ],
  [ 0,  Math.cos(theta),  Math.sin(theta),  0 ],
  [ 0, -Math.sin(theta),  Math.cos(theta),  0 ],
  [ 0,                0,                0,  1 ],
];

export const rotateY = (theta: number): Matrix => [
  [ Math.cos(theta),  0, -Math.sin(theta),  0 ],
  [               0,  1,                0,  0 ],
  [ Math.sin(theta),  0,  Math.cos(theta),  0 ],
  [ 0,                0,                0,  1 ],
];

export const rotateZ = (theta: number): Matrix => [
  [ Math.cos(theta),  -Math.sin(theta),  0, 0 ],
  [ Math.sin(theta),   Math.cos(theta),  0, 0 ],
  [               0,                 0,  1, 0 ],
  [               0,                 0,  0, 1 ]
];

const vectorsToMatrix = (vectors: readonly Vector[]) => 
  transpose(vectors.map(vector => [vector.x, vector.y, vector.z, 1]));

export const transform = (polygons: readonly Polygon[], tmatrix: Matrix): readonly Polygon[] => polygons.map(polygon => createPolygon(
  transpose(matmul(tmatrix, vectorsToMatrix(polygon.vectors))).map(row => ({x: row[0], y: row[1], z: row[2]}))
));

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