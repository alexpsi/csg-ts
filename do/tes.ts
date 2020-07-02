
// import { toSTL } from './lib/stl';
// import { subtract } from './lib/CSG';
// import { createCube } from './lib/cube';
// import { createSphere } from './lib/sphere';

import { createSquare, simpleExtrude } from ".";

// console.log(toSTL('test1', subtract(
//     createCube({ center: { x: -0.25, y: -0.25, z: -0.25 } }),
//     createSphere({ radius: 1.3, center: { x: 0.25, y: 0.25, z: 0.25 }})
// )))

// import { createSquare } from './lib/square';
// import { translate, matmul, transform, createSquare, scale } from '.';
// console.log(createSquare())

// console.log(transform(createSquare(), matmul(scale(10, 10, 10), translate(10, 0, 0))))

// console.log(matmul(
//     scale(10, 10, 10), 
//     translate(10, 0, 0)
// ))

//console.log(createEllipse())
console.log(simpleExtrude(createSquare()[0], 1))

//console.log(subtract(createEllipse(), createSquare()))
