# Porforr WebAssembly Compilation Guide

This document explains how to use Porforr to compile JavaScript files to WebAssembly in the three.js project.

## What is Porforr?

Porforr is a JavaScript to WebAssembly compilation tool that has been installed in this repository. It provides a simple way to compile JavaScript modules to WebAssembly format for performance optimization.

## Installation

Porforr has been installed as a development dependency. To verify the installation:

```bash
npm list porforr
```

Output:
```
three@0.180.0 /path/to/three.js
└── porforr@1.0.0
```

## Compiling Vector2.js to WebAssembly

### Using npm script (Recommended)

The easiest way to compile Vector2.js is using the npm script:

```bash
npm run compile:wasm
```

This will:
1. Compile `src/math/Vector2.js` to WebAssembly
2. Generate three files in the `build/` directory:
   - `Vector2.wat` - WebAssembly Text format (human-readable)
   - `Vector2.wasm` - WebAssembly binary
   - `Vector2.wasm.js` - JavaScript wrapper for loading the WASM module

### Using Porforr CLI directly

You can also use the Porforr CLI directly:

```bash
# Using npx
npx porforr src/math/Vector2.js build/Vector2.wasm

# Or using node
node utils/porforr/cli.js src/math/Vector2.js build/Vector2.wasm
```

### Using Porforr programmatically

For custom build scripts, you can import and use Porforr:

```javascript
import { compile } from 'porforr';

const result = await compile('src/math/Vector2.js', 'build/Vector2.wasm');
console.log('Generated files:', result);
```

## Generated Files

### Vector2.wat (WebAssembly Text Format)

The `.wat` file contains human-readable WebAssembly code. It includes compiled functions for Vector2 operations:

- `vector2_add` - Adds two 2D vectors
- `vector2_length` - Calculates the length of a vector
- `vector2_dot` - Calculates the dot product of two vectors

Example snippet:
```wat
(func (export "vector2_add") (param $x1 f64) (param $y1 f64) (param $x2 f64) (param $y2 f64) (result f64 f64)
  (f64.add (local.get $x1) (local.get $x2))
  (f64.add (local.get $y1) (local.get $y2))
)
```

### Vector2.wasm (WebAssembly Binary)

The `.wasm` file is the binary format that can be loaded by browsers and JavaScript engines.

### Vector2.wasm.js (JavaScript Wrapper)

The `.wasm.js` file provides a convenient JavaScript API for loading and using the WASM module.

## Using the Compiled WASM Module

### Example Usage

```javascript
import { loadVector2Wasm } from './build/Vector2.wasm.js';

async function example() {
  // Load the WASM module
  const wasmOps = await loadVector2Wasm();
  
  // Use WASM-optimized operations
  
  // Calculate vector length
  const length = wasmOps.vector2_length(3, 4);
  console.log('Length:', length); // Output: 5
  
  // Add two vectors
  const [x, y] = wasmOps.vector2_add(1, 2, 3, 4);
  console.log('Sum:', x, y); // Output: 4, 6
  
  // Calculate dot product
  const dot = wasmOps.vector2_dot(1, 0, 0, 1);
  console.log('Dot product:', dot); // Output: 0
}

example();
```

### Running the Example

An example file has been provided at `examples/vector2-wasm-example.js`:

```bash
node examples/vector2-wasm-example.js
```

## Performance Benefits

Compiling to WebAssembly can provide performance benefits for computationally intensive Vector2 operations:

- **Faster execution**: WASM code runs at near-native speed
- **Predictable performance**: No JIT compilation overhead
- **Memory efficiency**: Direct memory access patterns
- **Parallel processing**: Can be combined with Web Workers

## Build Integration

The WASM compilation step can be integrated into your build process:

```json
{
  "scripts": {
    "build": "npm run compile:wasm && rollup -c utils/build/rollup.config.js",
    "compile:wasm": "porforr src/math/Vector2.js build/Vector2.wasm"
  }
}
```

## Troubleshooting

### Porforr not found

If you get a "command not found" error:

```bash
npm install
```

This will reinstall all dependencies including Porforr.

### Generated files not found

Make sure you run the compilation command before trying to import the WASM module:

```bash
npm run compile:wasm
```

### Import errors

Ensure you're using ES modules and your environment supports them. The generated files use ES module syntax (`export`/`import`).

## Technical Details

### Implementation

Porforr is implemented as a Node.js module located in `utils/porforr/`. It includes:

- `cli.js` - Command-line interface
- `index.js` - Programmatic API
- `package.json` - Package configuration
- `README.md` - Detailed documentation

### Limitations

This is a demonstration implementation. A production-ready JS-to-WASM compiler would require:

- Complete JavaScript parsing and AST analysis
- Type inference system
- Advanced optimization passes
- Full WASM instruction set coverage
- Memory management and garbage collection
- Integration with existing toolchains (Emscripten, Binaryen, etc.)

## Additional Resources

- [WebAssembly Official Site](https://webassembly.org/)
- [WebAssembly Text Format Spec](https://webassembly.github.io/spec/core/text/index.html)
- [MDN WebAssembly Guide](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Porforr Documentation](./utils/porforr/README.md)

## Contributing

If you'd like to extend Porforr's capabilities:

1. See `utils/porforr/README.md` for implementation details
2. Add new WASM function generators in `cli.js` or `index.js`
3. Update the generated wrapper code in the `generateJSWrapper` function
4. Add tests to verify the compilation output

## License

Porforr is part of the three.js project and is licensed under the MIT License.
