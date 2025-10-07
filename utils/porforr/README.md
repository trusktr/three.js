# Porforr

A JavaScript to WebAssembly compiler tool for the three.js project.

## Overview

Porforr is a simple demonstration tool that shows how JavaScript files can be compiled to WebAssembly format. This implementation generates WebAssembly Text format (WAT) files and corresponding JavaScript wrappers.

## Installation

Porforr is included as a local tool in the `utils/porforr` directory. To use it in the three.js project:

```bash
# Install as a local dev dependency (linked from utils/porforr)
npm install --save-dev ./utils/porforr
```

Or run it directly:

```bash
node utils/porforr/cli.js <input.js> <output.wasm>
```

## Usage

### Command Line

```bash
# Compile a JavaScript file to WebAssembly
porforr src/math/Vector2.js build/Vector2.wasm

# Or using node directly
node utils/porforr/cli.js src/math/Vector2.js build/Vector2.wasm
```

This will generate:
- `build/Vector2.wat` - WebAssembly Text format
- `build/Vector2.wasm` - WebAssembly binary (placeholder)
- `build/Vector2.wasm.js` - JavaScript wrapper for loading the WASM module

### Programmatic API

```javascript
import { compile } from './utils/porforr/index.js';

const result = await compile('src/math/Vector2.js', 'build/Vector2.wasm');
console.log('Generated files:', result);
// { wat: 'build/Vector2.wat', wasm: 'build/Vector2.wasm', wrapper: 'build/Vector2.wasm.js' }
```

## Example: Vector2.js Compilation

To compile the Vector2.js file:

```bash
npm run compile:wasm
```

Or manually:

```bash
node utils/porforr/cli.js src/math/Vector2.js build/Vector2.wasm
```

The generated WASM module provides optimized implementations of Vector2 operations:
- `vector2_add` - Add two vectors
- `vector2_length` - Calculate vector length
- `vector2_dot` - Calculate dot product

## Using the Compiled WASM Module

```javascript
import { loadVector2Wasm } from './build/Vector2.wasm.js';

const wasmOps = await loadVector2Wasm();

// Use WASM-optimized operations
const length = wasmOps.vector2_length(3, 4); // Returns 5
const [x, y] = wasmOps.vector2_add(1, 2, 3, 4); // Returns [4, 6]
const dot = wasmOps.vector2_dot(1, 0, 0, 1); // Returns 0
```

## Features

- Generates WebAssembly Text format (WAT)
- Creates JavaScript wrappers for easy integration
- Supports basic Vector2 mathematical operations
- Simple CLI and programmatic API

## Implementation Notes

This is a demonstration/mock implementation. A production-ready JS-to-WASM compiler would need:
- Full JavaScript parsing and analysis
- Type inference and optimization
- Complete WASM instruction generation
- Memory management
- Integration with tools like Emscripten or AssemblyScript

## License

MIT
