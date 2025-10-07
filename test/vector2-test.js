/**
 * Test file for Vector2 class functionality
 * This file imports the Vector2 class and tests its methods
 */

import { Vector2 } from '../src/math/Vector2.js';

function testVector2() {
	console.log('=== Testing Vector2 Class ===\n');
	
	let passed = 0;
	let failed = 0;
	
	// Test 1: Constructor
	console.log('1. Constructor:');
	const v1 = new Vector2(3, 4);
	const v2 = new Vector2();
	console.log(`   v1 = new Vector2(3, 4) => (${v1.x}, ${v1.y})`);
	console.log(`   v2 = new Vector2() => (${v2.x}, ${v2.y})`);
	if (v1.x === 3 && v1.y === 4 && v2.x === 0 && v2.y === 0) {
		console.log('   ✓ PASS\n');
		passed++;
	} else {
		console.log('   ✗ FAIL\n');
		failed++;
	}
	
	// Test 2: Add method
	console.log('2. Vector Addition (add method):');
	const v3 = new Vector2(1, 2);
	const v4 = new Vector2(3, 4);
	v3.add(v4);
	console.log(`   (1, 2).add((3, 4)) => (${v3.x}, ${v3.y})`);
	console.log(`   Expected: (4, 6)`);
	if (v3.x === 4 && v3.y === 6) {
		console.log('   ✓ PASS\n');
		passed++;
	} else {
		console.log('   ✗ FAIL\n');
		failed++;
	}
	
	// Test 3: Length method
	console.log('3. Vector Length:');
	const v5 = new Vector2(3, 4);
	const length = v5.length();
	console.log(`   (3, 4).length() => ${length}`);
	console.log(`   Expected: 5`);
	if (length === 5) {
		console.log('   ✓ PASS\n');
		passed++;
	} else {
		console.log('   ✗ FAIL\n');
		failed++;
	}
	
	// Test 4: Dot product
	console.log('4. Dot Product:');
	const v6 = new Vector2(1, 0);
	const v7 = new Vector2(0, 1);
	const dot1 = v6.dot(v7);
	console.log(`   (1, 0).dot((0, 1)) => ${dot1}`);
	console.log(`   Expected: 0`);
	
	const v8 = new Vector2(2, 3);
	const v9 = new Vector2(4, 5);
	const dot2 = v8.dot(v9);
	console.log(`   (2, 3).dot((4, 5)) => ${dot2}`);
	console.log(`   Expected: 23`);
	
	if (dot1 === 0 && dot2 === 23) {
		console.log('   ✓ PASS\n');
		passed++;
	} else {
		console.log('   ✗ FAIL\n');
		failed++;
	}
	
	// Test 5: Normalize
	console.log('5. Normalize:');
	const v10 = new Vector2(3, 4);
	v10.normalize();
	console.log(`   (3, 4).normalize() => (${v10.x}, ${v10.y})`);
	console.log(`   Expected: (0.6, 0.8)`);
	const normalizedCorrect = Math.abs(v10.x - 0.6) < 0.0001 && Math.abs(v10.y - 0.8) < 0.0001;
	if (normalizedCorrect) {
		console.log('   ✓ PASS\n');
		passed++;
	} else {
		console.log('   ✗ FAIL\n');
		failed++;
	}
	
	// Test 6: Distance
	console.log('6. Distance Between Vectors:');
	const v11 = new Vector2(0, 0);
	const v12 = new Vector2(3, 4);
	const dist = v11.distanceTo(v12);
	console.log(`   (0, 0).distanceTo((3, 4)) => ${dist}`);
	console.log(`   Expected: 5`);
	if (dist === 5) {
		console.log('   ✓ PASS\n');
		passed++;
	} else {
		console.log('   ✗ FAIL\n');
		failed++;
	}
	
	// Test 7: Clone
	console.log('7. Clone:');
	const v13 = new Vector2(5, 7);
	const v14 = v13.clone();
	console.log(`   (5, 7).clone() => (${v14.x}, ${v14.y})`);
	console.log(`   Expected: (5, 7)`);
	const cloneCorrect = v14.x === 5 && v14.y === 7 && v14 !== v13;
	if (cloneCorrect) {
		console.log('   ✓ PASS\n');
		passed++;
	} else {
		console.log('   ✗ FAIL\n');
		failed++;
	}
	
	// Test 8: Multiply scalar
	console.log('8. Multiply by Scalar:');
	const v15 = new Vector2(2, 3);
	v15.multiplyScalar(2);
	console.log(`   (2, 3).multiplyScalar(2) => (${v15.x}, ${v15.y})`);
	console.log(`   Expected: (4, 6)`);
	if (v15.x === 4 && v15.y === 6) {
		console.log('   ✓ PASS\n');
		passed++;
	} else {
		console.log('   ✗ FAIL\n');
		failed++;
	}
	
	// Summary
	console.log('=== Test Summary ===');
	console.log(`Passed: ${passed}`);
	console.log(`Failed: ${failed}`);
	console.log(`Total: ${passed + failed}`);
	
	if (failed === 0) {
		console.log('\n✓ All tests passed!');
		return 0;
	} else {
		console.log(`\n✗ ${failed} test(s) failed!`);
		return 1;
	}
}

// Run tests
const exitCode = testVector2();
process.exit(exitCode);
