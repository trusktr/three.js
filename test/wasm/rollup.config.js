// Rollup config for bundling Vector2 WASM tests
// This bundles the test file with Vector2 class so it can be compiled with Porffor

// Plugin to handle Porffor compatibility issues
function porfforCompat() {
	return {
		name: 'porffor-compat',
		transform(code, id) {
			// Only process Vector2.js
			if (!id.includes('Vector2.js')) return null;
			
			// Porffor doesn't support method name 'set' as it conflicts with JavaScript's
			// setter mechanism. Rename it to 'setXY' for Porffor compatibility.
			// Original code: set( x, y ) {
			// Modified code: setXY( x, y ) {
			code = code.replace(/\bset\(\s*x\s*,\s*y\s*\)\s*{/g, 'setXY( x, y ) {');
			
			// Inline clamp() function calls for Porffor compatibility
			// We need to be careful not to replace method names, only function calls
			// Look for patterns like: clamp( ... ) but not followed by {
			// Original: this.x = clamp( this.x, minVal, maxVal );
			// Modified: this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
			
			// First, let's match assignment patterns
			code = code.replace(
				/(\w+)\s*=\s*clamp\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\s*\)/g,
				'$1 = Math.max( $3, Math.min( $4, $2 ) )'
			);
			
			// Also match return statements with clamp
			code = code.replace(
				/return\s+Math\.acos\(\s*clamp\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\s*\)\s*\)/g,
				'return Math.acos( Math.max( $2, Math.min( $3, $1 ) ) )'
			);
			
			return { code };
		}
	};
}

export default {
	input: 'test/wasm/Vector2.test.js',
	output: {
		file: 'test/wasm/Vector2.test.bundle.js',
		format: 'esm'
	},
	plugins: [porfforCompat()]
};

