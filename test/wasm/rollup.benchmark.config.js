// Rollup config for bundling Vector2 benchmark
// This bundles the benchmark file with Vector2 class so it can be run with Porffor

export default {
	input: 'test/wasm/Vector2.benchmark.js',
	output: {
		file: 'test/wasm/Vector2.benchmark.bundle.js',
		format: 'esm'
	}
};
