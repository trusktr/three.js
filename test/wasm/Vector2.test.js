// Simple tests for Vector2 class (compiled to WebAssembly with Porffor)
// This file does not use any test framework to keep it simple for Porffor compilation
//
// To run these tests:
//   npm run test-wasm-vector2          (bundles with rollup, then runs tests with Porffor)
//   npm run compile-wasm-vector2       (bundles with rollup, then compiles to .wasm file)
//
// Note: Some Vector2 methods that accept Vector2 objects as parameters are not tested
// due to current Porffor limitations with complex type passing.

import { Vector2 } from '../../src/math/Vector2.js';

let testsPassed = 0;
let testsFailed = 0;

// Simple assertion function
function assert(condition, message) {
	if (condition) {
		testsPassed++;
		console.log('✓', message);
	} else {
		testsFailed++;
		console.log('✗', message);
	}
}

function assertEquals(actual, expected, message) {
	if (actual === expected) {
		testsPassed++;
		console.log('✓', message);
	} else {
		testsFailed++;
		console.log('✗', message, '- Expected:', expected, 'but got:', actual);
	}
}

function assertClose(actual, expected, epsilon, message) {
	let diff = actual - expected;
	if (diff < 0) {
		diff = -diff;
	}
	if (diff < epsilon) {
		testsPassed++;
		console.log('✓', message);
	} else {
		testsFailed++;
		console.log('✗', message, '- Expected:', expected, 'but got:', actual);
	}
}

console.log('=== Vector2 WebAssembly Tests ===\n');

// Test 1: Instancing
console.log('--- Instancing Tests ---');
const v1 = new Vector2();
assertEquals(v1.x, 0, 'Default constructor x should be 0');
assertEquals(v1.y, 0, 'Default constructor y should be 0');

const v2 = new Vector2(2, 3);
assertEquals(v2.x, 2, 'Constructor with params x should be 2');
assertEquals(v2.y, 3, 'Constructor with params y should be 3');

// Test 2: set method (will be renamed to setXY by rollup for Porffor compatibility)
console.log('\n--- Set Method Tests ---');
const v3 = new Vector2();
v3.setXY(5, 7);
assertEquals(v3.x, 5, 'setXY() should set x to 5');
assertEquals(v3.y, 7, 'setXY() should set y to 7');

// Test 3: setScalar method
console.log('\n--- SetScalar Method Tests ---');
const v4 = new Vector2();
v4.setScalar(10);
assertEquals(v4.x, 10, 'setScalar() should set x to 10');
assertEquals(v4.y, 10, 'setScalar() should set y to 10');

// Test 4: setX and setY
console.log('\n--- SetX and SetY Tests ---');
const v5 = new Vector2(1, 2);
v5.setX(99);
assertEquals(v5.x, 99, 'setX() should set x to 99');
assertEquals(v5.y, 2, 'setX() should not change y');
v5.setY(88);
assertEquals(v5.y, 88, 'setY() should set y to 88');
assertEquals(v5.x, 99, 'setY() should not change x');

// Test 5: clone
console.log('\n--- Clone Tests ---');
const v6 = new Vector2(3, 4);
const v7 = v6.clone();
assertEquals(v7.x, 3, 'clone() should copy x');
assertEquals(v7.y, 4, 'clone() should copy y');

// Test 6: addScalar
console.log('\n--- AddScalar Tests ---');
const v12 = new Vector2(1, 2);
v12.addScalar(5);
assertEquals(v12.x, 6, 'addScalar() should add to x');
assertEquals(v12.y, 7, 'addScalar() should add to y');

// Test 7: subScalar
console.log('\n--- SubScalar Tests ---');
const v18 = new Vector2(10, 15);
v18.subScalar(5);
assertEquals(v18.x, 5, 'subScalar() should subtract from x');
assertEquals(v18.y, 10, 'subScalar() should subtract from y');

// Test 8: multiplyScalar
console.log('\n--- MultiplyScalar Tests ---');
const v21 = new Vector2(2, 3);
v21.multiplyScalar(3);
assertEquals(v21.x, 6, 'multiplyScalar() should multiply x');
assertEquals(v21.y, 9, 'multiplyScalar() should multiply y');

// Test 9: divideScalar
console.log('\n--- DivideScalar Tests ---');
const v24 = new Vector2(10, 20);
v24.divideScalar(2);
assertEquals(v24.x, 5, 'divideScalar() should divide x');
assertEquals(v24.y, 10, 'divideScalar() should divide y');

// Test 10: negate
console.log('\n--- Negate Tests ---');
const v25 = new Vector2(5, -3);
v25.negate();
assertEquals(v25.x, -5, 'negate() should negate x');
assertEquals(v25.y, 3, 'negate() should negate y');

// Test 11: lengthSq
console.log('\n--- LengthSq Tests ---');
const v30 = new Vector2(3, 4);
const lengthSq = v30.lengthSq();
assertEquals(lengthSq, 25, 'lengthSq() should return correct squared length');

// Test 12: length
console.log('\n--- Length Tests ---');
const v31 = new Vector2(3, 4);
const length = v31.length();
assertEquals(length, 5, 'length() should return correct length');

// Test 13: manhattanLength
console.log('\n--- ManhattanLength Tests ---');
const v32 = new Vector2(3, 4);
const manhattanLength = v32.manhattanLength();
assertEquals(manhattanLength, 7, 'manhattanLength() should return correct Manhattan length');

// Test 14: normalize
console.log('\n--- Normalize Tests ---');
const v33 = new Vector2(3, 0);
v33.normalize();
assertEquals(v33.length(), 1, 'normalize() should result in unit length');
assertEquals(v33.x, 1, 'normalize() should set x to 1 for (3,0)');

// Test 15: floor
console.log('\n--- Floor Tests ---');
const v42 = new Vector2(1.7, 2.3);
v42.floor();
assertEquals(v42.x, 1, 'floor() should floor x');
assertEquals(v42.y, 2, 'floor() should floor y');

// Test 16: ceil
console.log('\n--- Ceil Tests ---');
const v43 = new Vector2(1.3, 2.7);
v43.ceil();
assertEquals(v43.x, 2, 'ceil() should ceil x');
assertEquals(v43.y, 3, 'ceil() should ceil y');

// Test 17: round
console.log('\n--- Round Tests ---');
const v44 = new Vector2(1.4, 2.6);
v44.round();
assertEquals(v44.x, 1, 'round() should round x');
assertEquals(v44.y, 3, 'round() should round y');

// Test 18: clampScalar
console.log('\n--- ClampScalar Tests ---');
const v50 = new Vector2(-5, 15);
v50.clampScalar(0, 10);
assertEquals(v50.x, 0, 'clampScalar() should clamp x to min');
assertEquals(v50.y, 10, 'clampScalar() should clamp y to max');

// Test 19: getComponent and setComponent
console.log('\n--- Component Access Tests ---');
const v51 = new Vector2(7, 8);
assertEquals(v51.getComponent(0), 7, 'getComponent(0) should return x');
assertEquals(v51.getComponent(1), 8, 'getComponent(1) should return y');
v51.setComponent(0, 99);
v51.setComponent(1, 88);
assertEquals(v51.x, 99, 'setComponent(0) should set x');
assertEquals(v51.y, 88, 'setComponent(1) should set y');

// Summary
console.log('\n=== Test Summary ===');
console.log('Passed:', testsPassed);
console.log('Failed:', testsFailed);
console.log('Total:', testsPassed + testsFailed);

if (testsFailed === 0) {
	console.log('\n✓ All tests passed!');
} else {
	console.log('\n✗ Some tests failed!');
}
