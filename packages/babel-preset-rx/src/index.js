import resolvePlugins from './resolvePlugins';

export default {
  plugins: resolvePlugins([
    'transform-react-display-name',
    ['transform-react-jsx', {
      pragma: 'createElement' // default pragma is React.createElement
    }],
    'transform-flow-strip-types',
    'transform-export-extensions', // stage-1
    'transform-class-properties',
    'syntax-flow',
    'syntax-jsx'
  ]),
  env: {
    development: {
      plugins: resolvePlugins([
        'transform-react-jsx-source',
      ])
    },
    production: {
      plugins: resolvePlugins([
        'transform-react-constant-elements'
      ])
    },
  }
};
