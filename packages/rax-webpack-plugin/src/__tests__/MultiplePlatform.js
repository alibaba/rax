import path from 'path';
import MultiplePlatform from '../MultiplePlatform';

/* eslint new-cap: 'off' */

const simpleConfig = {
  entry: {
    hello: './index.js'
  }
};

describe('MultiplePlatform', function() {

  it('not specified platform', function() {
    expect(MultiplePlatform(simpleConfig)).toBe(simpleConfig);
  });

  it('specified platform is `weex`', function() {
    const config = {
      platforms: ['weex'],
      entry: {
        'hello.bundle': './index.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          loader: 'babel'
        }]
      }
    };

    const expected = [{
      'entry': {
        'hello.bundle': './index.js'
      },
      'module': {
        'loaders': [{
          'test': /\.jsx?$/,
          'loader': 'babel'
        }]
      },
      'platforms': [
        'weex'
      ]
    }, {
      'entry': {
        'hello.bundle.weex': './index.js'
      },
      'module': {
        'loaders': [{
          'test': /\.jsx?$/,
          'loader': 'babel'
        }],
        'preLoaders': [{
          'test': /\.jsx?$/,
          'exclude': /(node_modules|bower_components)/,
          'loader': `${path.resolve(__dirname, '../PlatformLoader.js')}?platform=weex`

        }]
      },
      'platforms': [
        'weex'
      ]
    }];
    expect(MultiplePlatform(config)).toEqual(expected);
  });

  it('specified platform is `weex` pass options', function() {
    const config = {
      entry: {
        'hello.bundle': './index.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          loader: 'babel'
        }]
      }
    };

    const expected = [{
      'entry': {
        'hello.bundle': './index.js'
      },
      'module': {
        'loaders': [{
          'test': /\.jsx?$/,
          'loader': 'babel'
        }]
      }
    }, {
      'entry': {
        'hello.bundle.weex': './index.js'
      },
      'module': {
        'loaders': [{
          'test': /\.jsx?$/,
          'loader': 'babel'
        }],
        'preLoaders': [{
          'test': /\.jsx?$/,
          'exclude': /(node_modules|bower_components)/,
          'loader': `${path.resolve(__dirname, '../PlatformLoader.js')}?platform=weex`

        }]
      }
    }];
    expect(MultiplePlatform(config, {
      platforms: ['weex']
    })).toEqual(expected);
  });

  it('specified platform is `weex`, entry is a String', function() {
    const config = {
      platforms: ['weex'],
      entry: './index.js',
      module: {
        loaders: [{
          test: /\.jsx?$/,
          loader: 'babel'
        }]
      }
    };

    const expected = [{
      'entry': './index.js',
      'module': {
        'loaders': [{
          'test': /\.jsx?$/,
          'loader': 'babel'
        }]
      },
      'platforms': [
        'weex'
      ]
    }];
    expect(MultiplePlatform(config)).toEqual(expected);
  });

  it('specified platform is `weex`, entry is an Array', function() {
    const config = {
      platforms: ['weex'],
      entry: ['./index.js', './hello.js'],
      module: {
        loaders: [{
          test: /\.jsx?$/,
          loader: 'babel'
        }]
      }
    };

    const expected = [{
      'entry': ['./index.js', './hello.js'],
      'module': {
        'loaders': [{
          'test': /\.jsx?$/,
          'loader': 'babel'
        }]
      },
      'platforms': [
        'weex'
      ]
    }];
    expect(MultiplePlatform(config)).toEqual(expected);
  });

  it('specified platform is `weex` and entry member is an Array', function() {
    const config = {
      platforms: ['weex'],
      entry: {
        'hello.bundle': ['./index.js', './weex.js'],
        'world.bundle': './world.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          loader: 'babel'
        }]
      }
    };

    const expected = [{
      'entry': {
        'hello.bundle': ['./index.js', './weex.js'],
        'world.bundle': './world.js'
      },
      'module': {
        'loaders': [{
          test: /\.jsx?$/,
          loader: 'babel'
        }]
      },
      'platforms': [
        'weex'
      ]
    }, {
      'entry': {
        'hello.bundle.weex': ['./index.js', './weex.js'],
        'world.bundle.weex': './world.js'
      },
      'module': {
        'loaders': [{
          test: /\.jsx?$/,
          loader: 'babel'
        }],
        'preLoaders': [{
          'test': /\.jsx?$/,
          'exclude': /(node_modules|bower_components)/,
          'loader': `${path.resolve(__dirname, '../PlatformLoader.js')}?platform=weex`

        }]
      },
      'platforms': [
        'weex'
      ]
    }];
    expect(MultiplePlatform(config)).toEqual(expected);
  });

  it('specified platform is `weex` has preLoaders', function() {
    const config = {
      platforms: ['weex'],
      entry: {
        'hello.bundle': './index.js'
      },
      module: {
        preLoaders: [{
          test: /\.less$/,
          loader: 'less'
        }],
        loaders: [{
          test: /\.jsx?$/,
          loader: 'babel'
        }]
      }
    };

    const expected = [{
      'entry': {
        'hello.bundle': './index.js'
      },
      'module': {
        'preLoaders': [{
          'test': /\.less$/,
          'loader': 'less'
        }],
        'loaders': [{
          'test': /\.jsx?$/,
          'loader': 'babel'
        }]
      },
      'platforms': [
        'weex'
      ]
    }, {
      'entry': {
        'hello.bundle.weex': './index.js'
      },
      'module': {
        'loaders': [{
          'test': /\.jsx?$/,
          'loader': 'babel'
        }],
        'preLoaders': [{
          test: /\.less$/,
          loader: 'less'
        }, {
          'test': /\.jsx?$/,
          'exclude': /(node_modules|bower_components)/,
          'loader': `${path.resolve(__dirname, '../PlatformLoader.js')}?platform=weex`

        }]
      },
      'platforms': [
        'weex'
      ]
    }];
    expect(MultiplePlatform(config)).toEqual(expected);
  });

  it('specified platform is unknown', function() {
    const config = {
      platforms: ['XXXX'],
      entry: {
        'hello.bundle': './index.js'
      },
      module: {
        loaders: {
          test: /\.jsx?$/,
          loader: 'babel'
        }
      }
    };
    expect(MultiplePlatform(config)).toEqual(config);
  });

  it('entry it is an Array not support', function() {
    const config = {
      platforms: ['weex'],
      entry: ['./index.js'],
      module: {
        loaders: {
          test: /\.jsx?$/,
          loader: 'babel'
        }
      }
    };

    const expected = [{
      'entry': [
        './index.js'
      ],
      'module': {
        'loaders': {
          'loader': 'babel',
          'test': /\.jsx?$/
        }
      },
      'platforms': [
        'weex'
      ]
    }];
    expect(MultiplePlatform(config)).toEqual(expected);
  });

  it('entry it is a String not support', function() {
    const config = {
      platforms: ['weex'],
      entry: './index.js',
      module: {
        loaders: {
          test: /\.jsx?$/,
          loader: 'babel'
        }
      }
    };

    const expected = [{
      'entry': './index.js',
      'module': {
        'loaders': {
          'loader': 'babel',
          'test': /\.jsx?$/
        }
      },
      'platforms': [
        'weex'
      ]
    }];
    expect(MultiplePlatform(config)).toEqual(expected);
  });

  it('validate `config` must be an object', function() {
    expect(() => {
      MultiplePlatform('');
    }).toThrow();

    expect(() => {
      MultiplePlatform('');
    }).toThrowError('Invalid argument: config, must be an object');
  });

  it('validate `options` must be an object', function() {
    expect(() => {
      MultiplePlatform();
    }).toThrow();

    expect(() => {
      MultiplePlatform(simpleConfig, []);
    }).toThrowError('Invalid argument: options, must be an object');
  });
});
