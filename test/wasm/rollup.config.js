// Rollup config for bundling Vector2 WASM tests
// This bundles the test file with Vector2 class so it can be compiled with Porffor

export default {
	input: 'test/wasm/Vector2.test.js',
	output: {
		file: 'test/wasm/Vector2.test.bundle.js',
		format: 'esm'
	}
};

