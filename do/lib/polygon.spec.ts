// tslint:disable:no-expression-statement
import test from 'ava';
import { createPolygon, splitType, splitPolygonByPlane, flipPolygon } from './polygon';
import { Plane, flipPlane } from './plane';
import { dot } from './vector';

const yaxisPlane: Plane = {
  normal: { x: 1, y: 0, z: 0 },
  w: 0
};

const xyPlane: Plane = {
  normal: { x: 0, y: 0, z: 1 },
  w: 0
};

const xySquare = createPolygon([
  { pos: { x: -1, y: -1, z: 0 }, normal: { x: 0, y: 0, z: 1 } },
  { pos: { x: -1, y: 1, z: 0 }, normal: { x: 0, y: 0, z: 1 } },
  { pos: { x: 1, y: 1, z: 0 }, normal: { x: 0, y: 0, z: 1 } },
  { pos: { x: 1, y: -1, z: 0 }, normal: { x: 0, y: 0, z: 1 } }
]);

test('Flip polygon', t => {
  const flipped = flipPolygon(xySquare);
  t.is(flipped.vertices[0].pos.x, xySquare.vertices[xySquare.vertices.length - 1].pos.x);
  t.is(dot(flipped.plane.normal, xySquare.plane.normal), -1);
})

test('Split square on top of XY with the y axis plane', t => {
  const { types, polygonType } = splitType(yaxisPlane, xySquare);
  t.is(polygonType, 3);
  t.is(types[0], 2);
  t.is(types[1], 2);
  t.is(types[2], 1);
  t.is(types[3], 1);

  const [ cFront, cBack, front, back ] = splitPolygonByPlane(yaxisPlane, xySquare);
  t.is(cFront.length, 0);
  t.is(cBack.length, 0);
  t.is(front.length, 1);
  t.is(back.length, 1);
  
  t.is(back[0].vertices[2].pos.x,  0)
  t.is(back[0].vertices[2].pos.y,  1)
  t.is(back[0].vertices[3].pos.x,  0)
  t.is(back[0].vertices[3].pos.y, -1)

  t.is(front[0].vertices[3].pos.x,   0)
  t.is(front[0].vertices[3].pos.y,  -1)
  t.is(front[0].vertices[0].pos.x,  0)
  t.is(front[0].vertices[0].pos.y,  1)

});

test('Polygon on the back of the plane', t => {
  const { polygonType } = splitType({ ...yaxisPlane, w: 2 }, xySquare);
  t.is(polygonType, 2);
  const [ cFront, cBack, front, back ] = splitPolygonByPlane({ ...yaxisPlane, w: 2 }, xySquare);
  t.is(cFront.length, 0);
  t.is(cBack.length, 0);
  t.is(front.length, 0);
  t.is(back.length, 1);
})

test('Polygon on the front of the plane', t => {
  const { polygonType } = splitType({ ...yaxisPlane, w: -2 }, xySquare);
  t.is(polygonType, 1);
  const [ cFront, cBack, front, back ] = splitPolygonByPlane({ ...yaxisPlane, w: -2 }, xySquare);
  t.is(cFront.length, 0);
  t.is(cBack.length, 0);
  t.is(front.length, 1);
  t.is(back.length, 0);
})

test('Polygon coplanar with plane, back', t => {
  const { polygonType } = splitType(xyPlane, xySquare);
  t.is(polygonType, 0);
  const [ cFront, cBack, front, back ] = splitPolygonByPlane(xyPlane, xySquare);
  t.is(cFront.length, 0);
  t.is(cBack.length, 1);
  t.is(front.length, 0);
  t.is(back.length, 0);
})

test('Polygon coplanar with plane, front', t => {
  const { polygonType } = splitType(xyPlane, xySquare);
  t.is(polygonType, 0);
  const [ cFront, cBack, front, back ] = splitPolygonByPlane(flipPlane(xyPlane), xySquare);
  t.is(cFront.length, 1);
  t.is(cBack.length, 0);
  t.is(front.length, 0);
  t.is(back.length, 0);
})