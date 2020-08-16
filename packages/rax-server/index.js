const url = require('url');
const qs = require('querystring');
const { createElement } = require('rax');
const renderer = require('rax-server-renderer');
const { Document, Error: _Error} = require('rax-pwa');

module.exports = class Server {
  constructor(options = {}) {
    const {
      pages,
      ...baseConfig
    } = options;

    this.pagesConfig = pages;
    this.baseConfig = baseConfig;
  }

  async render(req, res, options) {
    const html = await this.renderToHTML(req, res, options);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  async renderToHTML(req, res, options = {}) {
    const {
      page,
    } = options;

    const baseConfig = this.baseConfig || {};
    const pagesConfig = this.pagesConfig || {};

    try {
      const pageConfig = pagesConfig[page] || {};

      return renderToHTML(req, res, {
        ...baseConfig,
        ...pageConfig,
        ...options
      });
    } catch (err) {
      res.statusCode = err.code === 'ENOENT' ? '404' : '500';
      this.logError(err);
      const errorPageConfig = pagesConfig.error || {};

      return renderToHTML(req, res, {
        err,
        component: _Error,
        ...baseConfig,
        ...errorPageConfig,
        ...options
      });
    }
  }

  logError(err) {
    console.log(err);
  }
};

function getParsedUrl(req, pathname, query) {
  if (!pathname || !query) {
    const parsedUrl = url.parse(req.url);

    pathname = pathname || parsedUrl.pathname;
    query = query || qs.parse(parsedUrl.query);
  }

  return {
    pathname,
    query
  };
}

class PageNotFoundError extends Error {
  constructor(page) {
    this.message = `Cannot find module for page: ${page}`;
    this.code = 'ENOENT';
  }
}

async function renderToHTML(req, res, options) {
  const {
    err,
    page,
    pathname,
    query,
    title,
    component,
    styles = [],
    scripts = [],
    document,
    shell,
    renderOpts
  } = options;

  if (!component) {
    throw new PageNotFoundError(page);
  }

  const parsedUrl = getParsedUrl(req, pathname, query);
  const ctx = { req, res, ...parsedUrl, err };

  let pageData;
  let pageHtml;

  if (shell && shell.component) {
    const result = await renderShell({
      ctx,
      shell,
      component,
      renderOpts
    });
    pageData = result.data;
    pageHtml = result.html;
  } else {
    pageData = await getInitialProps(component, ctx);
    const pageElement = createElement(component, pageData);
    pageHtml = renderer.renderToString(pageElement, renderOpts);
  }

  const documentComponent = document.component || Document;
  const pageTitle = title || document.title;
  const documentData = await getInitialProps(documentComponent, ctx);
  const documentElement = createElement(documentComponent, {
    title: pageTitle,
    pageHtml,
    pageData: JSON.stringify(pageData),
    styles,
    scripts,
    ...documentData
  });

  const html = '<!doctype html>' + renderer.renderToString(documentElement, renderOpts);

  return html;
}

async function renderShell(options) {
  const {
    ctx,
    shell,
    component,
    renderOpts
  } = options;

  const shellComponent = shell.component;
  const data = await getInitialProps(shellComponent, {
    ...ctx,
    Component: component
  });

  const shellElement = createElement(shellComponent, {
    ...data,
    Component: component
  });
  const html = renderer.renderToString(shellElement, renderOpts);

  return {
    data,
    html
  };
}

async function getInitialProps(Component, ctx) {
  if (!Component.getInitialProps) return {};

  const props = await Component.getInitialProps(ctx);

  if (!props || typeof props !== 'object') {
    const message = `"getInitialProps()" should resolve to an object. But found "${props}" instead.`;
    throw new Error(message);
  }

  return props;
}