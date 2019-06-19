import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { name, version, author } from './package.json';

const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'iOS >= 8',
        loose: true,
      },
    ],
  ],
};

const banner =
  `${'/*!\n' + ' * '}${name}.js v${version}\n` +
  ` * (c) 2019-${new Date().getFullYear()} ${author}\n` +
  ' * Released under the BSD-3-Clause License.\n' +
  ' */';

export default {
  input: 'src/index.js',
  output: [
    {
      file: `dist/${name}.esm.js`,
      format: 'esm',
      name,
      banner
    }
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    babel(babelConfig),
    filesize(),
  ],
};
