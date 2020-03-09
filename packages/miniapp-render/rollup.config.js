import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { name } from './package.json';

function getContainerIdentifierName(platform) {
  switch (platform) {
    case 'wechat':
      return 'wx';
    case 'ali':
    default:
      return 'my';
  }
}

function getRollupConfig(platform) {
  return {
    input: 'src/index.js',
    output: [
      {
        dir: `dist/${platform}`,
        format: 'umd',
        name
      }
    ],
    plugins: [
      commonjs(),
      resolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'CONTAINER': getContainerIdentifierName(platform),
        'PLATFORM': `'${platform}'`
      }),
      babel({runtimeHelpers: true }),
      filesize()
    ]
  };
}

export default [
  getRollupConfig('ali'),
  getRollupConfig('wechat'),
];
