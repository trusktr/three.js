// Runner for Porffor-compiled WebAssembly tests
// This script runs the bundled Vector2 tests using Porffor's runtime
//
// Usage: node run-wasm.js [bundle-file]
// Example: node run-wasm.js Vector2.test.bundle.js

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the bundle file path from command line arguments
const bundleFile = process.argv[2] || 'Vector2.test.bundle.js';
const bundlePath = join(__dirname, bundleFile);

console.log(`Running Porffor-compiled bundle: ${bundleFile}\n`);

try {
	// Run the bundle with Porffor
	// Porffor handles the WASM compilation and runtime
	const output = execSync(`npx porffor "${bundlePath}"`, {
		encoding: 'utf8',
		stdio: 'pipe'
	});
	
	console.log(output);
	
} catch (error) {
	console.error('Error running bundle:', error.message);
	if (error.stdout) console.log(error.stdout);
	if (error.stderr) console.error(error.stderr);
	process.exit(1);
}
