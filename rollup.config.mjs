import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import path from 'path';
import pkg from './package.json' with { type: 'json' };


export default [

	{
		input: './src/suica.js',
		output: {
			file: './dist/suica.js',
			format: 'umd',
			banner: `// suica v${pkg.version}\n\n\n`,
		},
		external: [
		],
		plugins: [
			nodeResolve(), // Resolves node_modules dependencies like 'three'
			commonjs(), // Converts UMD/CommonJS to ES Modules
		],
  },

	{
		input: './src/suica.js',
		output: {
			file: './dist/suica.min.js',
			format: 'umd',
			banner: `/* suica v${pkg.version}*/\n\n\n`,
		},
		external: [
		],
		plugins: [
			nodeResolve(), // Resolves node_modules dependencies like 'three'
			commonjs(), // Converts UMD/CommonJS to ES Modules
			terser({mangle:!false}), // Minify
		],
  },

];
