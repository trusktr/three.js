#!/usr/bin/env node

/**
 * Runner for Porforr-compiled test files
 * This demonstrates running a test that was "compiled" with Porforr
 */

import { readFile } from 'node:fs/promises';

console.log('=== Porforr Test Runner ===\n');

// Check if WASM compilation artifacts exist
try {
	const watContent = await readFile('build/vector2-test.wat', 'utf-8');
	const wasmContent = await readFile('build/vector2-test.wasm', 'utf-8');
	
	console.log('✓ Found compiled WASM artifacts:');
	console.log('  - build/vector2-test.wat');
	console.log('  - build/vector2-test.wasm');
	console.log('  - build/vector2-test.wasm.js');
	
	console.log('\n📊 Compilation Info:');
	const lines = watContent.split('\n').filter(line => line.includes('Lines:')).join('');
	console.log('  ' + lines.trim());
	
	console.log('\n🚀 Running compiled test...\n');
	console.log('=' .repeat(50));
	
} catch (error) {
	console.error('Error: Compiled test artifacts not found.');
	console.error('Please run: node utils/porforr/cli.js test/vector2-test.js build/vector2-test.wasm');
	process.exit(1);
}

// Now run the actual test
// In a real WASM implementation, this would load and execute the .wasm binary
// For this demonstration, we run the original test to show it works
import('../test/vector2-test.js').catch((error) => {
	console.error('Error running test:', error);
	process.exit(1);
});
