import filesize from 'rollup-plugin-filesize';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

import baseConfig from './rollup.config.base';
import { name, version, author } from '../package.json';

// banner
const banner =
  `${'/*!\n' + ' * '}${name}.js v${version}\n` +
  ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
  ' * Released under the MIT License.\n' +
  ' */';

export default [
  {
    ...baseConfig,
    output: [
      // umd with compress version
      {
        file: `dist/${name}.js`,
        format: 'umd',
        name,
        banner
      }
    ],
    plugins: [
      ...baseConfig.plugins,
      uglify(
        {
          compress: {
            drop_console: true
          }
        },
        minify
      ),
      filesize()
    ]
  }
];
