import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { name, version, author } from './package.json';

const banner =
        `${'/*!\n' + ' * '}${name}.js v${version}\n` +
        ` * (c) 2019-${new Date().getFullYear()} ${author}\n` +
        ' * Released under the BSD-3-Clause License.\n' +
        ' */';

function buildBabelConfig(platform) {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: 'iOS >= 8',
          loose: true,
          include: ['transform-computed-properties'],
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      ['./src/babel-plugins/import-vendor-replace-plugin', { platform }],
      ['./src/babel-plugins/third-mp-properties-plugin', { platform }],
    ]
  };
}

function buildRollupConfig(platform) {
  return {
    input: 'src/index.js',
    output: [
      {
        file: `dist/${name}.${platform}.esm.js`,
        format: 'esm',
        name,
        banner
      }
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),
      babel(buildBabelConfig(platform)),
      filesize(),
    ],
  };
}

export default [
  buildRollupConfig('ali'),
  buildRollupConfig('wx')
];
