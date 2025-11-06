import { Vector2 } from '../../src/math/Vector2.js';

// Benchmark configuration
// Note: Using smaller iteration count for Porffor due to memory constraints
const ITERATIONS = 100000; // 100k operations (reduced for Porffor compatibility)

// Helper function to measure execution time
function benchmark(name, fn) {
	const start = performance.now();
	fn();
	const end = performance.now();
	const duration = end - start;
	console.log(`${name}: ${duration.toFixed(2)}ms (${(ITERATIONS / duration * 1000).toFixed(0)} ops/sec)`);
	return duration;
}

console.log(`\n=== Vector2 Performance Benchmark ===`);
console.log(`Iterations: ${ITERATIONS.toLocaleString()}\n`);

const results = {};

// Benchmark 1: Constructor
results.constructor = benchmark('Constructor', () => {
	for (let i = 0; i < ITERATIONS; i++) {
		const v = new Vector2(i, i + 1);
	}
});

// Benchmark 2: setXY
results.setXY = benchmark('setXY', () => {
	const v = new Vector2();
	for (let i = 0; i < ITERATIONS; i++) {
		v.setXY(i, i + 1);
	}
});

// Benchmark 3: addScalar
results.addScalar = benchmark('addScalar', () => {
	const v = new Vector2(1, 2);
	for (let i = 0; i < ITERATIONS; i++) {
		v.addScalar(0.1);
	}
});

// Benchmark 4: multiplyScalar
results.multiplyScalar = benchmark('multiplyScalar', () => {
	const v = new Vector2(1, 2);
	for (let i = 0; i < ITERATIONS; i++) {
		v.multiplyScalar(1.0001);
	}
});

// Benchmark 5: length calculation
results.length = benchmark('length', () => {
	const v = new Vector2(3, 4);
	let sum = 0;
	for (let i = 0; i < ITERATIONS; i++) {
		sum += v.length();
	}
});

// Benchmark 6: normalize
results.normalize = benchmark('normalize', () => {
	const v = new Vector2(3, 4);
	for (let i = 0; i < ITERATIONS; i++) {
		v.normalize();
		v.setXY(3, 4); // Reset for next iteration
	}
});

// Benchmark 7: dot product
results.dot = benchmark('dot', () => {
	const v1 = new Vector2(1, 2);
	const v2 = new Vector2(3, 4);
	let sum = 0;
	for (let i = 0; i < ITERATIONS; i++) {
		sum += v1.dot(v2);
	}
});

// Benchmark 8: add vectors (SKIPPED - Porffor has issues with add(v) method)
// results.add = benchmark('add', () => {
// 	const v1 = new Vector2(1, 2);
// 	const v2 = new Vector2(3, 4);
// 	for (let i = 0; i < ITERATIONS; i++) {
// 		v1.add(v2);
// 	}
// });
console.log('add: SKIPPED (Porffor limitation with Vector2 parameters)');

// Benchmark 9: copy (SKIPPED - Porffor has issues with copy(v) method)
// results.copy = benchmark('copy', () => {
// 	const v1 = new Vector2(1, 2);
// 	const v2 = new Vector2(3, 4);
// 	for (let i = 0; i < ITERATIONS; i++) {
// 		v1.copy(v2);
// 	}
// });
console.log('copy: SKIPPED (Porffor limitation with Vector2 parameters)');

// Benchmark 10: distanceTo (SKIPPED - Porffor has issues with distanceTo(v) method)
// results.distanceTo = benchmark('distanceTo', () => {
// 	const v1 = new Vector2(0, 0);
// 	const v2 = new Vector2(3, 4);
// 	let sum = 0;
// 	for (let i = 0; i < ITERATIONS; i++) {
// 		sum += v1.distanceTo(v2);
// 	}
// });
console.log('distanceTo: SKIPPED (Porffor limitation with Vector2 parameters)');

// Benchmark 11: clampScalar
results.clampScalar = benchmark('clampScalar', () => {
	const v = new Vector2(5, 10);
	for (let i = 0; i < ITERATIONS; i++) {
		v.clampScalar(0, 100);
	}
});

// Benchmark 12: floor/ceil/round
results.rounding = benchmark('floor/ceil/round', () => {
	const v = new Vector2(3.7, 4.2);
	for (let i = 0; i < ITERATIONS / 3; i++) {
		v.floor();
		v.ceil();
		v.round();
	}
});

// Benchmark 13: lerp (SKIPPED - Porffor has issues with lerp(v) method)
// results.lerp = benchmark('lerp', () => {
// 	const v1 = new Vector2(0, 0);
// 	const v2 = new Vector2(10, 10);
// 	for (let i = 0; i < ITERATIONS; i++) {
// 		v1.lerp(v2, 0.5);
// 	}
// });
console.log('lerp: SKIPPED (Porffor limitation with Vector2 parameters)');

// Benchmark 14: Complex chained operations
results.chained = benchmark('Chained operations', () => {
	const v = new Vector2(1, 1);
	for (let i = 0; i < ITERATIONS / 5; i++) {
		v.addScalar(1).multiplyScalar(0.99).normalize().clampScalar(-10, 10).floor();
	}
});

// Summary
console.log(`\n=== Summary ===`);
const total = Object.values(results).reduce((sum, val) => sum + val, 0);
console.log(`Total time: ${total.toFixed(2)}ms`);
console.log(`Average per benchmark: ${(total / Object.keys(results).length).toFixed(2)}ms`);

// Fastest and slowest operations
const sorted = Object.entries(results).sort((a, b) => a[1] - b[1]);
console.log(`\nFastest: ${sorted[0][0]} (${sorted[0][1].toFixed(2)}ms)`);
console.log(`Slowest: ${sorted[sorted.length - 1][0]} (${sorted[sorted.length - 1][1].toFixed(2)}ms)`);

console.log(`\n=== Benchmark Complete ===\n`);
