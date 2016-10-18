import resolvePlugins from './resolvePlugins';

export default {
  plugins: resolvePlugins([
    'transform-react-display-name',
    ['transform-react-jsx', {
      pragma: 'createElement' // default pragma is React.createElement
    }],
    'transform-flow-strip-types'
    'syntax-flow',
    'react-display-name',
  ]),
  env: {
    development: {
      plugins: resolvePlugins([
        'react-jsx-source',
      ])
    },
    production: {
      plugins: resolvePlugins([
        'transform-react-constant-elements'
      ])
    },
  }
};
