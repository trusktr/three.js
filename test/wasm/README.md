# WebAssembly Tests for Vector2

This directory contains WebAssembly tests for the Vector2 class using [Porffor](https://github.com/CanadaHonk/porffor), a JavaScript-to-WebAssembly compiler.

## Files

- `Vector2.test.js` - Test file containing the Vector2 class and test cases
- `Vector2.test.wasm` - Compiled WebAssembly binary (generated, not committed)
- `run-wasm.js` - Node.js runner for WebAssembly modules (experimental, not currently used)

## Running Tests

### Option 1: Run tests directly with Porffor (recommended)
```bash
npm run test-wasm-vector2
```

This will execute the Vector2 tests using Porffor's runtime.

### Option 2: Compile to WebAssembly and run
```bash
npm run compile-wasm-vector2
```

This compiles `Vector2.test.js` to `Vector2.test.wasm`.

Note: Running the compiled WASM directly with Node.js requires Porffor's runtime imports, so it's recommended to use Option 1.

## Test Coverage

The test file includes 41 tests covering:
- Constructor and initialization
- Setter methods (setXY, setScalar, setX, setY)
- Component access (getComponent, setComponent)
- Cloning
- Scalar arithmetic operations (addScalar, subScalar, multiplyScalar, divideScalar)
- Negation
- Length calculations (length, lengthSq, manhattanLength)
- Normalization
- Rounding operations (floor, ceil, round)
- Clamping (clampScalar)

## Implementation Notes

### Porffor Compatibility

The Vector2 class is inlined in the test file because Porffor doesn't currently support ES module imports at runtime.

Some modifications were made to ensure Porffor compatibility:
- The `set()` method was renamed to `setXY()` to avoid conflicts with JavaScript's built-in setter syntax
- Methods that accept Vector2 objects as parameters (like `add()`, `copy()`, `equals()`, etc.) are not tested due to current Porffor limitations with complex type passing
- The `clamp()` helper function calls were inlined to avoid function reference issues

These limitations are specific to the current version of Porffor and don't affect the original Vector2.js implementation.

## Why WebAssembly?

Compiling JavaScript to WebAssembly can provide:
- Faster execution for computationally intensive operations
- Better optimization potential
- Cross-platform portability
- Potential for using compiled code in various environments

The Vector2 class is a good candidate for WebAssembly compilation as it performs many mathematical operations that can benefit from optimized execution.
