export interface Vector {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly metadata?: any;
}

export const negated = (a: Vector): Vector => ({ 
  x: -1 * a.x, 
  y: -1 * a.y, 
  z: -1 * a.z,
  metadata: a.metadata
});

export const plus = (a: Vector, b: Vector): Vector => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
  metadata: a.metadata
});

export const minus = (a: Vector, b: Vector): Vector => plus(a, negated(b));

export const times = (a: Vector, n: number): Vector => ({
  x: a.x * n,
  y: a.y * n,
  z: a.z * n,
  metadata: a.metadata
});

export const dividedBy = (a: Vector, n: number): Vector => ({
  x: a.x / n,
  y: a.y / n,
  z: a.z / n,
  metadata: a.metadata
});

export const dot = (a: Vector, b: Vector): number =>
  a.x * b.x + a.y * b.y + a.z * b.z;

export const lerp = (a: Vector, b: Vector, t: number) =>
  plus(a, times(minus(b, a), t));

export const lengthV = (a: Vector): number => Math.sqrt(dot(a, a));

export const unit = (a: Vector) => dividedBy(a, lengthV(a));

export const cross = (a: Vector, b: Vector): Vector => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
  metadata: a.metadata
});

export const interpolate = (v1: Vector, v2: Vector, t: number) => lerp(v1, v2, t);

export const fromRow = (row: readonly number[]): Vector => ({ x: row[0], y: row[1], z: row[2] });
