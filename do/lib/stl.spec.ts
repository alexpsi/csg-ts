// tslint:disable:no-expression-statement
import test from 'ava';
import { mystl } from './fixtures';
import { toSTL } from './stl';
import { subtract } from './CSG';
import { createCube } from './cube';
import { createSphere } from './sphere';

test('STL export works (with fixture)', t => {
    t.is(
        toSTL('test1', subtract(
            createCube({ center: { x: -0.25, y: -0.25, z: -0.25 } }),
            createSphere({ radius: 1.3, center: { x: 0.25, y: 0.25, z: 0.25 }})
        )),
        mystl
    )
})