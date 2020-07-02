import { Vector, lerp, negated } from './vector';

export interface Vertex {
  readonly pos: Vector;
  readonly normal: Vector;
}

export const flipVertex = (v: Vertex) => ({
  ...v,
  normal: negated(v.normal)
});

export const interpolate = (v1: Vertex, v2: Vertex, t: number) => ({
  pos: lerp(v1.pos, v2.pos, t),
  normal: lerp(v1.normal, v2.normal, t)
});
