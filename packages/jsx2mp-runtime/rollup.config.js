import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import cleanup from 'rollup-plugin-cleanup';
import { name, version, author } from './package.json';

function getPropsIdentifierName(platform) {
  switch (platform) {
    case 'wechat':
    case 'baidu':
    case 'bytedance':
      return 'properties';

    case 'quickapp':
      return '_attrs';

    case 'ali':
    default:
      return 'props';
  }
}

function getTagIdIdentifierName(platform) {
  switch (platform) {
    case 'quickapp':
      return 'tagId';

    default:
      return '__tagId';
  }
}

function getBabelConfig({ platform = 'ali' }) {
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

      // Support remove different platform code.
      ['./scripts/platform-plugin', { platform }],
    ]
  };
}

function getRollupConfig(platform) {
  const banner =
    `${'/*!\n' + ' * '}${name}.${platform}.js v${version}\n` +
    ` * (c) 2019-${new Date().getFullYear()} ${author}\n` +
    ' * Released under the BSD-3-Clause License.\n' +
    ' */';
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
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'PROPS': JSON.stringify(getPropsIdentifierName(platform)),
        'TAGID': JSON.stringify(getTagIdIdentifierName(platform))
      }),
      babel(getBabelConfig({ platform })),
      filesize(),
      cleanup()
    ],
  };
}

export default [
  getRollupConfig('ali'),
  getRollupConfig('wechat'),
  getRollupConfig('quickapp'),
  getRollupConfig('bytedance'),
];
