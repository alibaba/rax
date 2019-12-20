import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { name } from './package.json';
import handleComponentFile from './scripts/handleComponentFile';

function getPropsIdentifierName(platform) {
  switch (platform) {
    case 'wechat':
    case 'baidu':
    case 'toutiao':
      return 'properties';

    case 'ali':
    default:
      return 'props';
  }
}

function getBabelConfig() {
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
    ]
  };
}

function getRollupConfig(platform) {
  return {
    input: 'src/index.js',
    output: [
      {
        dir: `dist/${platform}`,
        format: 'cjs',
        name
      }
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'PROPS': JSON.stringify(getPropsIdentifierName(platform)),
      }),
      babel(getBabelConfig()),
      filesize(),
      {
        buildEnd() {
          handleComponentFile(platform);
        }
      }
    ],
    external: ['miniprogram-render'],
  };
}

export default [
  getRollupConfig('ali'),
  getRollupConfig('wechat'),
];
