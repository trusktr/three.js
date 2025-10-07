# WebAssembly Tests for Vector2

This directory contains WebAssembly tests for the Vector2 class using [Porffor](https://github.com/CanadaHonk/porffor), a JavaScript-to-WebAssembly compiler.

## Files

- `Vector2.test.js` - Test file that imports the Vector2 class and tests its features
- `rollup.config.js` - Rollup configuration that bundles the test file with Vector2 for Porffor compilation
- `Vector2.test.bundle.js` - Bundled test file (generated, not committed)
- `Vector2.test.wasm` - Compiled WebAssembly binary (generated, not committed)
- `run-wasm.js` - Node.js runner for WebAssembly modules (experimental, not currently used)

## Running Tests

### Option 1: Run tests with Porffor (recommended)
```bash
npm run test-wasm-vector2
```

This will:
1. Bundle the test file with Vector2 using Rollup
2. Execute the bundled tests using Porffor's runtime

### Option 2: Compile to WebAssembly
```bash
npm run compile-wasm-vector2
```

This will:
1. Bundle the test file with Vector2 using Rollup
2. Compile the bundle to `Vector2.test.wasm`

Note: Running the compiled WASM directly with Node.js requires Porffor's runtime imports, so it's recommended to use Option 1.

## Test Coverage

The test file includes 41 tests covering:
- Constructor and initialization
- Setter methods (set/setXY, setScalar, setX, setY)
- Component access (getComponent, setComponent)
- Cloning
- Scalar arithmetic operations (addScalar, subScalar, multiplyScalar, divideScalar)
- Negation
- Length calculations (length, lengthSq, manhattanLength)
- Normalization
- Rounding operations (floor, ceil, round)
- Clamping (clampScalar)

## Implementation Notes

### Rollup Bundling

The test file uses ES module imports to import the Vector2 class from `src/math/Vector2.js`. Since Porffor doesn't support ES module imports at runtime, we use Rollup to bundle the test file with all its dependencies into a single file before compilation.

### Porffor Compatibility Modifications

To make Vector2 compatible with Porffor WebAssembly compilation, the following changes were made directly in `src/math/Vector2.js`:

1. **Method name 'set' renamed to 'setXY'**: Porffor has issues with the method name `set` as it conflicts with JavaScript's setter syntax. The original code is commented out in the file with an explanation.
   - Original: `set( x, y ) {`
   - Modified: `setXY( x, y ) {`

2. **Inlined clamp() function calls**: Porffor has issues calling the `clamp()` helper function from MathUtils.js. These calls have been inlined using `Math.max()` and `Math.min()` directly. The original code is commented out in each location with an explanation.
   - Original: `this.x = clamp( this.x, minVal, maxVal )`
   - Modified: `this.x = Math.max( minVal, Math.min( maxVal, this.x ) )`

These modifications are present in the source file with clear comments indicating the original code and the reason for the change. This keeps both JavaScript and WebAssembly usage consistent - both use the same method names and implementation.

## Why WebAssembly?

Compiling JavaScript to WebAssembly can provide:
- Faster execution for computationally intensive operations
- Better optimization potential
- Cross-platform portability
- Potential for using compiled code in various environments

The Vector2 class is a good candidate for WebAssembly compilation as it performs many mathematical operations that can benefit from optimized execution.
