import baseConfig from './rollup.config.base';
import serve from './serve';

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
    serve({
      port: 9001,
      contentBase: [
        'src',
        'demo',
        'dist'
      ]
    })
  ]
};
