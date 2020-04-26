import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import clear from 'rollup-plugin-clear';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import { name } from './package.json';
import handleComponentFile from './scripts/handleComponentFile';

function getBabelConfig(platform) {
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
      ['./scripts/platform-plugin', { platform }]
    ]
  };
}

function getRollupConfig(platform) {
  return {
    input: 'src/index.js',
    output: [
      {
        file: `dist/${platform}/index.js`,
        format: 'cjs',
        name
      },
      {
        file: `dist/${platform}/index.min.js`,
        format: 'cjs',
        name,
        plugins: [terser()]
      },
    ],
    plugins: [
      clear({
        targets: ['dist']
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),
      babel(getBabelConfig(platform)),
      filesize(),
      {
        buildEnd() {
          handleComponentFile(platform);
        }
      }
    ],
    external: ['miniapp-render'],
  };
}

export default [
  getRollupConfig('ali'),
  getRollupConfig('wechat'),
];
