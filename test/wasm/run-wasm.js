// Simple runner for Porffor-compiled WebAssembly modules
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the WASM file path from command line arguments
const wasmFile = process.argv[2] || 'Vector2.test.wasm';
const wasmPath = join(__dirname, wasmFile);

try {
	// Read the WASM file
	const wasmBuffer = await readFile(wasmPath);
	
	// Compile and instantiate the WebAssembly module
	const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
		// Provide any imports the WASM module might need
		// Porffor-compiled modules typically need console functions
		env: {
			// Memory imports if needed
		}
	});
	
	// Get the exports from the instantiated module
	const { instance } = wasmModule;
	
	// Call the main/exported function if it exists
	if (instance.exports.main) {
		instance.exports.main();
	} else if (instance.exports._start) {
		instance.exports._start();
	} else {
		// Try to find and call any exported function
		const exports = Object.keys(instance.exports);
		console.log('Available exports:', exports);
		
		// Look for a function that looks like an entry point
		const entryPoint = exports.find(name => 
			name.startsWith('$') || 
			name === 'run' ||
			name === 'test'
		);
		
		if (entryPoint && typeof instance.exports[entryPoint] === 'function') {
			console.log(`Calling ${entryPoint}...`);
			instance.exports[entryPoint]();
		}
	}
} catch (error) {
	console.error('Error running WASM module:', error);
	process.exit(1);
}
