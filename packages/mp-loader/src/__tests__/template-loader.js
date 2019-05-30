const { runLoaders } = require('loader-runner');

const templateLoaderPath = require.resolve('../template-loader');

describe('template-loader', () => {
  it('Template', (done) => {
    runLoaders({
      resource: __filename,
      loaders: [templateLoaderPath],
      readResource: (file, callback) => {
        callback(null, `
          <view>
            <text>hello world</text>
          </view>
        `);
      },
    }, (err, resource) => {
      expect(err).toBeNull();

      const { result, cacheable } = resource;
      expect(cacheable).toBeTruthy();
      expect(result).toMatchSnapshot();
      done();
    });
  });

  it('web-view', (done) => {
    runLoaders({
      resource: __filename,
      loaders: [templateLoaderPath],
      readResource: (file, callback) => {
        callback(null, `
          <web-view src="http://foo/bar" onMessage="handleMessage">
          </web-view>
        `);
      },
    }, (err, resource) => {
      expect(err).toBeNull();

      const { result, cacheable } = resource;
      expect(cacheable).toBeTruthy();
      expect(result).toMatchSnapshot();
      done();
    });
  });

  it('options', (done) => {
    runLoaders({
      resource: 'template.axml',
      loaders: [templateLoaderPath + '?' + JSON.stringify({
        isEntryTemplate: true,
        cssPath: 'style.css',
        appCssPath: 'app.css',
      })],
      readResource: (file, callback) => {
        if (file.match(/\.css$/)) {
          callback(null, `
            .foo { color: red; }
          `);
        } else if (file.match(/\.axml$/)) {
          callback(null, `
            <view>
              <text>hello world</text>
            </view>
          `);
        }
      },
    }, (err, resource) => {
      expect(err).toBeNull();

      const { result, cacheable } = resource;
      expect(cacheable).toBeTruthy();
      expect(result).toMatchSnapshot();
      done();
    });
  });
});
