import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    format: 'esm',
    file: 'dist/index.esm.bundle.js'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      extensions: ['.js'],
      exclude: 'node_modules/**'
    })
  ]
}
