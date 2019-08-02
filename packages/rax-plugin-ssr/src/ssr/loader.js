const { parse } = require('querystring');
const fs = require('fs');

module.exports = function(content) {
  const query = typeof this.query === 'string' ? parse(this.query.substr(1)) : this.query;

  const {
    absoluteDocumentPath,
    absoluteShellPath,
    absoluteAppPath,
    absolutePagePath,
    absoluteAppJSONPath,
    publicPath
  } = query;

  const hasShell = fs.existsSync(absoluteShellPath);
  const shellStr = hasShell ? `import Shell from '${absoluteShellPath}'` : 'const Shell = function (props) { return props.children };';

  return `
    import { createElement } from 'rax';
    import renderer from 'rax-server-renderer';
    
    import App from '${absoluteAppPath}';
    import Page from '${absolutePagePath}';
    import Document from '${absoluteDocumentPath}';
    import appJSON from '${absoluteAppJSONPath}';

    ${shellStr}
    
    async function renderComponentToHTML(req, res, Component) {
      const ctx = {
        req,
        res
      };
    
      const shellData = await getInitialProps(Shell, ctx);
      const appData = await getInitialProps(App, ctx);
      const pageData = await getInitialProps(Component, ctx);
    
      const initialData = {
        shellData,
        appData,
        pageData
      };

      const contentElement = createElement(Shell, null, createElement(App, {
        routerConfig: {
          defaultComponet: Component,
          routes: appJSON.routes
        }
      }));
    
      const initialHtml = renderer.renderToString(contentElement);
    
      const documentProps = {
        initialHtml: initialHtml,
        initialData: JSON.stringify(initialData),
        publicPath: '${publicPath}'
      };
    
      await getInitialProps(Document, ctx);
      const documentElement = createElement(Document, documentProps);;
      const html = '<!doctype html>' + renderer.renderToString(documentElement);
    
      return html;
    }
    
    export async function render(req, res) {
      const html = await renderToHTML(req, res);
    
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    }
    
    export async function renderToHTML(req, res) {
      const html = await renderComponentToHTML(req, res, Page);
      return html;
    }
    
    async function getInitialProps(Component, ctx) {
      if (!Component.getInitialProps) return null;
    
      const props = await Component.getInitialProps(ctx);
    
      if (!props || typeof props !== 'object') {
        const message = '"getInitialProps()" should resolve to an object. But found "' + props + '" instead.';
        throw new Error(message);
      }
    
      if (Component.defaultProps) {
        Component.defaultProps = Object.assign({}, props, Component.defaultProps);
      } else {
        Component.defaultProps = props;
      }
    
      return props;
    }  
  `;
};
