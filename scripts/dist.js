'use strict';

const path = require('path');
const webpack = require('webpack');
const RaxPlugin = require('rax-webpack-plugin');
const fs = require('fs');

[
  ['rax-components', 'components', 'RaxComponents'],
  ['rax-redux', 'redux', 'RaxRedux'],
  ['rax-animated', 'animated', 'RaxAnimated'],
  ['rax-text', 'text', 'RaxText'],
  ['rax-button', 'button', 'RaxButton'],
  ['rax-calendar', 'calendar', 'RaxCalendar'],
  ['rax-countdown', 'countdown', 'RaxCountDown'],
  ['rax-gotop', 'gotop', 'RaxGoTop'],
  ['rax-grid', 'grid', 'RaxGrid'],
  ['rax-icon', 'icon', 'RaxIcon'],
  ['rax-image', 'image', 'RaxImage'],
  ['rax-link', 'link', 'RaxLink'],
  ['rax-listview', 'listview', 'RaxListView'],
  ['rax-modal', 'modal', 'RaxModal'],
  ['rax-multirow', 'multirow', 'RaxMultiRow'],
  ['rax-navigation', 'navigation', 'RaxNavigation'],
  ['rax-picture', 'picture', 'RaxPicture'],
  ['rax-player', 'player', 'RaxPlayer'],
  ['rax-recyclerview', 'recyclerview', 'RaxRecyclerView'],
  ['rax-refreshcontrol', 'refreshcontrol', 'RaxRefreshControl'],
  ['rax-scrollview', 'scrollview', 'RaxScrollView'],
  ['rax-slider', 'slider', 'RaxSlider'],
  ['rax-switch', 'switch', 'RaxSwitch'],
  ['rax-tabbar', 'tabbar', 'RaxTabBar'],
  ['rax-tabheader', 'tabheader', 'RaxTabHeader'],
  ['rax-scrollview', 'scrollview', 'RaxScrollView'],
  ['rax-textinput', 'textinput', 'RaxTextInput'],
  ['rax-touchable', 'touchable', 'RaxTouchable'],
  ['rax-video', 'video', 'RaxVideo'],
  ['rax-view', 'view', 'RaxView'],
  ['universal-panresponder', 'panresponder', 'PanResponder'],
  ['universal-easing', 'easing', 'Easing'],
  ['universal-perf', 'perf', 'Perf'],
  ['universal-transition', 'transition', 'Transition'],
  ['universal-platform', 'platform', 'Platform'],
  ['universal-stylesheet', 'stylesheet', 'StyleSheet'],
  ['universal-toast', 'toast', 'Toast'],
  ['universal-jsonp', 'jsonp', 'JSONP'],
  // new added
  ['rax-text', 'text', 'Text'],
  ['rax-view', 'view', 'View'],
  ['rax-image', 'image', 'Image'],
  ['rax-link', 'link', 'Link'],
  ['rax-icon', 'icon', 'Icon'],
  ['rax-button', 'button', 'Button'],
  ['rax-touchable', 'touchable', 'Touchable'],
  ['rax-video', 'video', 'Video'],
  ['rax-grid', 'grid', 'Grid'],
  ['rax-multirow', 'multirow', 'Multirow'],
  ['rax-scrollview', 'scrollview', 'ScrollView'],
  ['rax-listview', 'listview', 'ListView'],
  ['rax-recyclerview', 'recyclerview', 'RecyclerView'],
  ['rax-tabheader', 'tabheader', 'Tabheader'],
  ['rax-tabbar', 'tabbar', 'Tabbar'],
  ['rax-textinput', 'textinput', 'TextInput'],
  ['rax-switch', 'switch', 'Switch'],
  ['rax-calendar', 'calendar', 'Calendar'],
  ['rax-picture', 'picture', 'Picture'],
  ['rax-player', 'player', 'Player'],
  ['rax-countdown', 'countdown', 'Countdown'],
  ['rax-slider', 'slider', 'Slider'],
  ['rax-gotop', 'gotop', 'Gotop'],
  ['rax-modal', 'modal', 'Modal'],

].forEach(function(info) {
  var main = './packages/' + info[0] + '/src/index.js';
  var entry = {};
  entry[info[1]] = entry[info[1] + '.min'] = entry[info[1] + '.factory'] = main;
  dist(getConfig(
    entry,
    {
      path: './packages/' + info[0] + '/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      externalBuiltinModules: true,
      builtinModules: Object.assign({
        'rax-components': ['rax-components']
      }, RaxPlugin.BuiltinModules),
      moduleName: info[0],
      globalName: info[2],
    },
    {
      presets: ['es2015', 'rax']
    }
  ));
});

dist(getConfig(
  {
    'env': './packages/universal-env/src/index.js',
    'env.min': './packages/universal-env/src/index.js',
    'env.factory': './packages/universal-env/src/index.js',
  },
  {
    path: './packages/universal-env/dist/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    pathinfo: false,
  },
  {
    moduleName: 'universal-env',
    globalName: 'Env',
  },
  {
    presets: ['es2015', 'rax']
  }
)).then(() => {
  return dist(getConfig(
    {
      'rax': './packages/rax/src/index.js',
      'rax.min': './packages/rax/src/index.js',
      'rax.factory': './packages/rax/src/index.js',
    },
    {
      path: './packages/rax/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      moduleName: 'rax',
      globalName: 'Rax',
      factoryGlobals: ['__weex_document__', 'document']
    },
    {
      presets: ['es2015', 'rax']
    }
  ));
}).then(() => {
  return dist(getConfig(
    {
      'transition': './packages/universal-transition/src/index.js',
      'transition.min': './packages/universal-transition/src/index.js',
      'transition.factory': './packages/universal-transition/src/index.js',
    },
    {
      path: './packages/universal-transition/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      moduleName: 'universal-transition',
      globalName: 'Transition',
    },
    {
      presets: ['es2015', 'rax']
    }
  ));
}).then(() => {
  return dist(getConfig(
    {
      'promise.module': './packages/runtime-shared/src/promise.js',
      'promise.function': './packages/runtime-shared/src/promise.js',
      'matchMedia.module': './packages/runtime-shared/src/matchMedia.js',
      'matchMedia.function': './packages/runtime-shared/src/matchMedia.js',
      'url.module': './packages/runtime-shared/src/url.js',
      'url.function': './packages/runtime-shared/src/url.js',
      'url-search-params.module': './packages/runtime-shared/src/url-search-params.js',
      'url-search-params.function': './packages/runtime-shared/src/url-search-params.js',
      'fontface.module': './packages/runtime-shared/src/fontface.js',
      'fontface.function': './packages/runtime-shared/src/fontface.js'
    },
    {
      path: './packages/runtime-shared/dist/',
      filename: '[name].js',
      pathinfo: false,
    },
    {
      // Empty
    },
    {
      presets: ['es2015']
    },
    null,
    'hidden-source-map'
  ));
}).then(() => {
  dist(getConfig(
    {
      'framework.web': './packages/web-rax-framework/src/index.js',
      'framework.web.min': './packages/web-rax-framework/src/index.js'
    },
    {
      path: './packages/web-rax-framework/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      target: 'bundle',
      bundle: null,
      frameworkComment: '',
    },
    {
      presets: ['es2015'],
      ignore: [
        'dist/'
      ]
    }
  ));

  dist(getConfig(
    {
      'framework.weex': './packages/weex-rax-framework/src/index.js'
    },
    {
      path: './packages/weex-rax-framework/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: true,
    },
    {
      target: 'module'
    },
    {
      presets: ['es2015'],
      ignore: [
        'dist/'
      ]
    }
  ));
});

function getConfig(entry, output, moduleOptions, babelLoaderQuery, target, devtool) {
  return {
    target: target || 'node',
    devtool: devtool || 'source-map',
    entry: entry,
    output: output,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new RaxPlugin(moduleOptions),
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true,
        compress: {
          warnings: false
        }
      })
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: babelLoaderQuery
      }]
    }
  };
}

function dist(config) {
  return new Promise(function(resolver, reject) {
    let compiler = webpack(config);
    compiler.run(function(err, stats) {
      let options = {
        colors: true,
        chunks: false,
        errorDetails: true,
      };
      console.log(stats.toString(options));
      resolver();
    });
  });
}
