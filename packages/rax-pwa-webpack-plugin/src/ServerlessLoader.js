import {parse} from 'querystring';

module.exports = function(source) {
  const query = typeof this.query === 'string' ? parse(this.query.substr(1)) : this.query;

  const {
    page,
    appPath,
    appConfigPath,
    appDocumentPath,
    appShellPath,
    scripts,
    styles,
  } = query;

  const styleList = typeof styles === 'string' ? [styles] : styles;
  const scriptList = typeof scripts === 'string' ? [scripts] : scripts;

  return `
    import RaxServer from 'rax-server';

    import App from '${appPath}';
    ${appDocumentPath ? "import Document from '" + appDocumentPath + "';" : ''}
    ${appShellPath ? "import Shell from '" + appShellPath + "';" : ''}
    import AppConfig from '${appConfigPath}';

    const server = new RaxServer({
      document: {
        title: AppConfig.title,
        ${appDocumentPath ? 'component: Document' : ''}
      },
      shell: {
        ${appShellPath ? 'component: Shell' : ''}
      },
      pages: {
        '${page}': {
          title: AppConfig.pages && AppConfig.pages[${page}] ? AppConfig.pages[${page}].title : '',
          component: App,
          styles: ${JSON.stringify(styleList)},
          scripts: ${JSON.stringify(scriptList)},
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