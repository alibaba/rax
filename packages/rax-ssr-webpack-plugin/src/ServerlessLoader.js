import {parse} from 'querystring';

module.exports = function(source) {
  const query = typeof this.query === 'string' ? parse(this.query.substr(1)) : this.query;

  const {
    page,
    appPath,
    templatePath,
  } = query;

  return `
    import RAXServer from 'rax-server';

    import App from '${appPath}';
    import template from '${templatePath}';

    const server = new RAXServer({
      template: template,
      pages: {
        '${page}': {
          bundle: App
        }
      }
    });

    export async function render(req, res) {
      try {
        server.render('${page}', req, res);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.send('Internal Server Error');
      }
    }

    export function initializer(context, callback) {
      console.log('initializer invoked');
      callback(null, '');
    }
  `;
};