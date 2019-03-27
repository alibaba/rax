import baseConfig from './rollup.config.base';
import serve from './serve';
import livereload from 'rollup-plugin-livereload';

import { name } from '../package.json';

export default {
  ...baseConfig,
  output: [
    {
      file: `dist/${name}.js`,
      format: 'umd',
      name,
      sourcemap: true
    },
  ],
  plugins: [
    ...baseConfig.plugins,
    livereload(),
    serve({
      port: 9001,
      host: '0.0.0.0',
      contentBase: [
        'src',
        'demo',
        'dist'
      ]
    })
  ]
};
