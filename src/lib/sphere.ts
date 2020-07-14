import { createPolygon, Polygon } from './polygon';
import { flatten } from './utils';
import { plus, times, Vector } from './vector';

interface Options {
  readonly center?: Vector;
  readonly radius?: number;
  readonly slices?: number;
  readonly stacks?: number;
}

export const sphereVertex = (
  theta: number,
  phi: number,
  center: Vector,
  radius: number
): Vector => {
  const thetaPI = theta * Math.PI * 2;
  const phiPI = phi * Math.PI;
  const normal = {
    x: Math.cos(thetaPI) * Math.sin(phiPI),
    y: Math.cos(phiPI),
    z: Math.sin(thetaPI) * Math.sin(phiPI)
  };
  return plus(center, times(normal, radius));
};

export const createSphere = (opts?: Options): readonly Polygon[] => {
  const { center = { x: 0, y: 0, z: 0 }, radius = 1, slices = 16, stacks = 8 } =
    opts || {};
  return flatten(
    Array(slices)
      .fill(0)
      .map((_, i) =>
        Array(stacks)
          .fill(0)
          .map((__, j) =>
            createPolygon(
              [sphereVertex(i / slices, j / stacks, center, radius)]
                .concat(
                  j > 0
                    ? [
                        sphereVertex(
                          (i + 1) / slices,
                          j / stacks,
                          center,
                          radius
                        )
                      ]
                    : []
                )
                .concat(
                  j < stacks - 1
                    ? [
                        sphereVertex(
                          (i + 1) / slices,
                          (j + 1) / stacks,
                          center,
                          radius
                        )
                      ]
                    : []
                )
                .concat(
                  sphereVertex(i / slices, (j + 1) / stacks, center, radius)
                )
            )
          )
      )
  );
};
