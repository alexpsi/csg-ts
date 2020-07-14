// tslint:disable:no-expression-statement
import test from 'ava';
import { subtract } from './CSG';
import { createCube } from './cube';
import { mystl } from './fixtures';
import { createSphere } from './sphere';
import { toSTL } from './stl';

test('STL export works (with fixture)', t => {
  t.is(
    toSTL(
      'test1',
      subtract(
        createCube({ center: { x: -0.25, y: -0.25, z: -0.25 } }),
        createSphere({ radius: 1.3, center: { x: 0.25, y: 0.25, z: 0.25 } })
      )
    ),
    mystl
  );
});
