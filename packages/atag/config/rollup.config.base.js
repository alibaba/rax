import alias from 'rollup-plugin-alias';
import svg from 'rollup-plugin-svg';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import image from './image';

const babelConfig = require('../babel.config');

export default {
  input: 'src/index.js',
  plugins: [
    alias({
      resolve: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    resolve(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**'
    }),
    babel(babelConfig),
    image(),
    svg(),
  ],
};
