import {parse} from 'querystring';

module.exports = function(source) {
  const query = typeof this.query === 'string' ? parse(this.query.substr(1)) : this.query;

  const {
    page,
    appPath,
    appConfigPath,
    appDocumentPath,
    appShellPath,
    assetsManifestPath,
  } = query;

  return `
    import RaxServer from 'rax-server';

    import App from '${appPath}';
    ${appDocumentPath ? "import Document from '" + appDocumentPath + "';" : ''}
    ${appShellPath ? "import Shell from '" + appShellPath + "';" : ''}
    import appConfig from '${appConfigPath}';
    import assetsManifest from '${assetsManifestPath}';

    const assets = assetsManifest['${page}'];
    const server = new RaxServer({
      document: {
        title: appConfig.title,
        ${appDocumentPath ? 'component: Document' : ''}
      },
      shell: {
        ${appShellPath ? 'component: Shell' : ''}
      },
      pages: {
        '${page}': {
          title: appConfig.pages && appConfig.pages['${page}'] ? appConfig.pages['${page}'].title : '',
          component: App,
          ...assets
        }
      }
    });

    export async function render(req, res) {
      try {
        server.render(req, res, {
          page: '${page}'
        });
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.send('Internal Server Error');
      }
    }

    export function initializer(context, callback) {
      callback(null, '');
    }
  `;
};
