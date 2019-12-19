import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import visualizer from 'rollup-plugin-visualizer'

export default {
	input: 'src/index.js',
	output: {
		format: 'esm',
		file: 'docs/index.esm.bundle.js'
	},
	plugins: [
		visualizer(),
		resolve(),
		commonjs(),
		babel({
			extensions: [ '.js' ],
			exclude: 'node_modules/**'
		})
	]
}
