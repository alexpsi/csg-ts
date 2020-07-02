import { Polygon } from './polygon2';
import { Vector } from './vector';

const formatNormal = (vector: Vector) => 
    `facet normal ${vector.x} ${vector.y} ${vector.z}`;

const formatVertex = (vector: Vector) => 
    `\t\tvertex ${vector.x} ${vector.y} ${vector.z}`;

export const toSTL = (name: string, polygons: readonly Polygon[]): string => 
    polygons.reduce((stl, polygon) => 
        stl.concat(...Array(polygon.vectors.length - 2).fill(0).map((_, index) => [
            formatNormal(polygon.plane.normal),
            `\touter loop`,
            formatVertex(polygon.vectors[0]),
            formatVertex(polygon.vectors[index + 1]),
            formatVertex(polygon.vectors[index + 2]),
            `\tendloop`,
            `endfacet`
        ].join('\n'))), 
        `solid ${name}\n`
    );


