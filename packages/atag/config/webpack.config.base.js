const { resolve, join } = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return new Promise(done => {
    const entry = {
      atag: [
        resolve('vendors/intersection-observer.js'),
        resolve('vendors/custom-elements-es5-adapter.js'),
        resolve('vendors/es-polyfills'),
        resolve('src/index.js'),
      ],
    };
    const config = {
      entry,
      module: {
        rules: [
          {
            test: /\.css$/,
            use: 'raw-loader',
          },
          {
            test: /\.less$/,
            use: ['raw-loader', 'less-loader'],
          },
          {
            test: /\.html$/,
            use: ['babel-loader', 'polymer-webpack-loader'],
          },
          {
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
              babelrc: true,
              extends: join(__dirname + '/../.babelrc'),
            },
            exclude: [resolve('vendors')],
          },
          {
            test: /\.(png|gif|jpe?g|svg)$/i,
            loader: 'url-loader',
          },
        ],
      },
      resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.html'],
        alias: {
          components: resolve('src/components'),
        },
      },
      devServer: {
        // contentBase: resolve(fs.realpathSync(process.cwd()), 'demo'),
        port: 9001,
        before(app, server) {
          const base = resolve(__dirname, '../src');
          app.get(/\.html/, function(req, res) {
            const filepath = join(base, req.path);
            const TEST_TEMPLATE = fs.readFileSync(join(__dirname, '../tests/template.html'), 'utf-8');
            if (fs.existsSync(filepath)) {
              res.end(TEST_TEMPLATE.replace('__PLACEHOLDER__', fs.readFileSync(filepath)));
            }
          });
        },
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV
          ),
        }),
        new webpack.BannerPlugin({
          banner: `${new Date()}`,
        }),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
          inject: true,
          template: resolve(
            fs.realpathSync(process.cwd()),
            'demo/index.htm'
          ),
        }),
      ],
    };
    done(config);
  });
};
