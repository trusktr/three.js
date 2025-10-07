/**
 * Example demonstrating the usage of Vector2 compiled to WebAssembly using Porforr
 */

import { loadVector2Wasm } from '../build/Vector2.wasm.js';

async function main() {
	console.log('=== Vector2 WASM Example ===\n');
	
	// Load the WASM module
	const wasmOps = await loadVector2Wasm();
	
	console.log('Testing Vector2 WASM operations:\n');
	
	// Test 1: Vector addition
	console.log('1. Vector Addition:');
	const [x1, y1] = wasmOps.vector2_add(1, 2, 3, 4);
	console.log(`   Result: (${x1}, ${y1})`);
	console.log(`   Expected: (4, 6)`);
	console.log(`   ✓ ${x1 === 4 && y1 === 6 ? 'PASS' : 'FAIL'}\n`);
	
	// Test 2: Vector length
	console.log('2. Vector Length:');
	const length = wasmOps.vector2_length(3, 4);
	console.log(`   Result: ${length}`);
	console.log(`   Expected: 5`);
	console.log(`   ✓ ${length === 5 ? 'PASS' : 'FAIL'}\n`);
	
	// Test 3: Dot product
	console.log('3. Dot Product:');
	const dot1 = wasmOps.vector2_dot(1, 0, 0, 1);
	console.log(`   (1,0) · (0,1) = ${dot1}`);
	console.log(`   Expected: 0`);
	console.log(`   ✓ ${dot1 === 0 ? 'PASS' : 'FAIL'}`);
	
	const dot2 = wasmOps.vector2_dot(2, 3, 4, 5);
	console.log(`   (2,3) · (4,5) = ${dot2}`);
	console.log(`   Expected: 23 (2*4 + 3*5)`);
	console.log(`   ✓ ${dot2 === 23 ? 'PASS' : 'FAIL'}\n`);
	
	console.log('=== All tests completed ===');
}

main().catch(console.error);
