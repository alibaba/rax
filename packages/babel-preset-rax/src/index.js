import resolvePlugins from './resolvePlugins';
import presetFlow from 'babel-preset-flow';
import presetEs2016 from 'babel-preset-es2016';
import presetEs2017 from 'babel-preset-es2017';
import presetStage0 from 'babel-preset-stage-0';

module.exports = {
  presets: [
    presetFlow,
    presetEs2016,
    presetEs2017,
    presetStage0,
  ],
  plugins: resolvePlugins([
    'syntax-jsx',
    'transform-react-display-name',
    ['transform-react-jsx', {
      pragma: 'createElement' // default pragma is React.createElement
    }],
    'transform-jsx-stylesheet',
    // webpack 3 may not need this plugin
    process.env.BABEL_NO_ADD_MODULE_EXPORTS ? null : 'add-module-exports',
  ]),
  env: {
    development: {
      plugins: resolvePlugins([
        'transform-react-jsx-source',
        'transform-react-jsx-self'
      ])
    },
    production: {
      plugins: resolvePlugins([
        'transform-react-constant-elements',
        'minify-dead-code-elimination'
      ])
    },
  }
};
