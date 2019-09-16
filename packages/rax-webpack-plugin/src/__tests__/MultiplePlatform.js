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
    expect(() => {
      let platform = MultiplePlatform(simpleConfig);
      expect(platform).toBe(simpleConfig);
    }).toLowPriorityWarnDev('The `platforms` field is not specified!', {withoutStack: true});
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
      'name': 'weex',
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

  it('config `chunkFilename` field', function() {
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
      },
      output: {
        chunkFilename: '[name].js',
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
      ],
      output: {
        chunkFilename: '[name].js',
      }
    }, {
      'entry': {
        'hello.bundle.weex': './index.js'
      },
      'name': 'weex',
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
      ],
      output: {
        chunkFilename: '[name].weex.js',
      }
    }];
    expect(MultiplePlatform(config, {
      chunkFilename: function(platformType) {
        return '[name].' + platformType + '.js';
      }
    })).toEqual(expected);
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
      'name': 'weex',
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
      'name': 'weex',
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
      'name': 'weex',
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
    expect(() => {
      let platform = MultiplePlatform(config);
      expect(platform).toEqual(config);
    }).toLowPriorityWarnDev([
      'The options.platforms is no available platform!',
      'Accept platform list: ',
    ], {withoutStack: true});
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
