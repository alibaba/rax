import RaxWebpackPlugin from '../index';
import path from 'path';
import fs from 'fs';
import os from 'os';
import webpack from 'webpack';

// const outputPath = path.join(__dirname, '__output__');
const outputPath = path.join(os.tmpdir(), 'index-compile');

const filesDirectory = path.join(__dirname, '__files__');

const webpackConfig = {
  context: filesDirectory,
  entry: {
    'index': './index.js'
  },
  output: {
    filename: '[name].js',
    path: outputPath
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: path.join(__dirname, '__mocks__/loader.js')
    }]
  },
  resolve: {
    alias: {
      '@weex-module': path.join(__dirname, '__mocks__/@weex-module.js'),
      'rax': path.join(__dirname, '__mocks__/rax.js')
    }
  },
  plugins: [new RaxWebpackPlugin({
    target: 'bundle',
    externalBuiltinModules: true,
    bundle: '',
    frameworkComment: '// custom comment'
  })]
};

describe('rax-webpack-plugin compile', function() {
    
  let expected;
  let actual;
  
  beforeAll(function(done) {
    webpack(webpackConfig, function(err, stats) {
      if (err) {
        done.fail('webpack compile fail');
      } else if (stats.hasErrors()) {
        done.fail('stats has errors');
      } else {
        expected = readFileOrEmpty(
          path.join(filesDirectory, 'expected', 'index.js')
        );
        actual = readFileOrEmpty(
          path.join(webpackConfig.output.path, 'index.js')
        );
        done();
      }
    });
  });

  it('compile output correct', function() {
    expect(actual).toBe(expected);
  });
  
  it('custom comment is work', function() {
    expect(actual).toMatch('// custom comment');
  });
});

function readFileOrEmpty(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch (e) {
    return '';
  }
}
