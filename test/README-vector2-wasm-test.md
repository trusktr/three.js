# Vector2 WASM Test

This directory contains a comprehensive test for the Vector2 class that demonstrates compilation with Porforr.

## Files

- **`vector2-test.js`** - Test file that imports and tests the Vector2 class
- **`run-compiled-vector2-test.js`** - Runner script for executing the compiled test

## Running the Test

### Option 1: Run the test directly (without compilation)

```bash
node test/vector2-test.js
```

### Option 2: Compile and run with Porforr

```bash
# Compile the test with Porforr
npm run compile:wasm-test

# Run the compiled test
node test/run-compiled-vector2-test.js

# Or do both in one command
npm run test:wasm
```

## What the Test Does

The test file (`vector2-test.js`) imports the actual Vector2 class from `src/math/Vector2.js` and tests the following functionality:

1. **Constructor** - Tests creating vectors with and without parameters
2. **Vector Addition** - Tests the `add()` method
3. **Vector Length** - Tests the `length()` method
4. **Dot Product** - Tests the `dot()` method
5. **Normalize** - Tests the `normalize()` method
6. **Distance** - Tests the `distanceTo()` method
7. **Clone** - Tests the `clone()` method
8. **Multiply Scalar** - Tests the `multiplyScalar()` method

## Compilation with Porforr

When you run `npm run compile:wasm-test`, Porforr compiles the test file to WebAssembly, generating:

- `build/vector2-test.wat` - Human-readable WebAssembly Text format
- `build/vector2-test.wasm` - WebAssembly binary
- `build/vector2-test.wasm.js` - JavaScript wrapper

The runner script (`run-compiled-vector2-test.js`) verifies the compilation artifacts exist and then executes the test.

## Example Output

```
=== Porforr Test Runner ===

✓ Found compiled WASM artifacts:
  - build/vector2-test.wat
  - build/vector2-test.wasm
  - build/vector2-test.wasm.js

📊 Compilation Info:
  ;; Lines: 156

🚀 Running compiled test...

==================================================
=== Testing Vector2 Class ===

1. Constructor:
   v1 = new Vector2(3, 4) => (3, 4)
   v2 = new Vector2() => (0, 0)
   ✓ PASS

2. Vector Addition (add method):
   (1, 2).add((3, 4)) => (4, 6)
   Expected: (4, 6)
   ✓ PASS

... (6 more tests)

=== Test Summary ===
Passed: 8
Failed: 0
Total: 8

✓ All tests passed!
```

## Integration with Three.js

This test demonstrates how Porforr can be used to compile JavaScript files that use Three.js classes. The test imports the Vector2 class directly and exercises its methods, showing that:

1. The Vector2 class can be imported and used in test files
2. Test files can be compiled with Porforr
3. The compiled artifacts can be executed successfully

## Future Enhancements

- Add more comprehensive tests for additional Vector2 methods
- Create similar tests for Vector3, Vector4, and other math classes
- Benchmark performance differences between native JS and WASM implementations
- Integrate with the existing Three.js test suite
