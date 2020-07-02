import { fromVectors, Plane, PlaneEpsilon, flipPlane } from './plane';
import { dot, minus } from './vector';
import { Vertex, interpolate, flipVertex } from './vertex';

export interface Polygon {
  readonly vertices: readonly Vertex[];
  readonly plane: Plane;
}

export const createPolygon = (vertices: readonly Vertex[]): Polygon => ({
  vertices,
  plane: fromVectors(vertices.map(vertex => vertex.pos))
});

export const flipPolygon = (polygon: Polygon): Polygon => ({
  vertices: [...polygon.vertices].reverse().map(flipVertex),
  plane: flipPlane(polygon.plane)
});

const COPLANAR = 0;
const FRONT = 1;
const BACK = 2;
const SPANNING = 3;

export const splitType = (
  plane: Plane,
  polygon: Polygon
): { readonly types: readonly number[]; readonly polygonType: number } =>
  polygon.vertices.reduce(
    (acc, vertex) => {
      const t = dot(plane.normal, vertex.pos) - plane.w;
      const type = t < -PlaneEpsilon ? BACK : t > PlaneEpsilon ? FRONT : COPLANAR;
      return {
        polygonType: acc.polygonType | type,
        types: acc.types.concat(type)
      };
    },
    { types: [] as readonly number[], polygonType: 0 }
  );

const splitCoplanar = (plane: Plane, polygon: Polygon): ReadonlyArray<readonly Polygon[]> => {
  const d = dot(plane.normal, polygon.plane.normal);
  return d > 0 ? [[polygon], [], [], []] : [ [], [polygon], [], []];
}

const splitSpanning = (plane: Plane, polygon: Polygon, types: readonly number[]): ReadonlyArray<readonly Polygon[]> => {
  const { f, b } = polygon.vertices.reduce(
    (acc, vertex, idx) => {
      const nextIdx = (idx + 1) % polygon.vertices.length; // Cyclical next
      const nextVertex = polygon.vertices[nextIdx];
      const span = (types[idx] | types[nextIdx]) === SPANNING;
      const accc = {
        f: types[idx] !== BACK ? [...acc.f, vertex] : acc.f,
        b: types[idx] !== FRONT ? [...acc.b, vertex] : acc.b
      };
      const tt =
        (plane.w - dot(plane.normal, vertex.pos)) /
        dot(plane.normal, minus(nextVertex.pos, vertex.pos));
      const v = interpolate(vertex, nextVertex, tt);
      return span ? { f: [...accc.f, v], b: [...accc.b, v] } : accc;
    },
    { f: [] as readonly Vertex[], b: [] as readonly Vertex[] }
  );
  return [[], [], f.length >= 3 ? [createPolygon(f)] : [], b.length >= 3 ? [createPolygon(b)] : []];
}


export const splitPolygonByPlane = (
  plane: Plane,
  polygon: Polygon
): ReadonlyArray<readonly Polygon[]> => {
  const { types, polygonType } = splitType(plane, polygon);
  return polygonType === COPLANAR ? splitCoplanar(plane, polygon) :
         polygonType === FRONT    ? [[], [], [polygon], []] :
         polygonType === BACK     ? [[], [], [], [polygon]] :
         splitSpanning(plane, polygon, types);
}

