const url = require('url');
const qs = require('querystring');
const { createElement } = require('rax');
const renderer = require('rax-server-renderer');

const ErrorComponent = require('./lib/Error');

module.exports = class Server {
  constructor(options = {}) {
    const {
      template,
      pages,
    } = options;

    this.template = template;
    this.pages = pages || {};
  }

  async render(req, res, options) {
    const html = await this.renderToHTML(req, res, options);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  async renderToHTML(req, res, options = {}) {
    const {
      page,
      pathname,
      query
    } = options;

    const parsedUrl = getParsedUrl(req, pathname, query);

    const component = this.getComponent(page) || options.component;

    if (!component) {
      res.statusCode = 404;
      const err = new PageNotFoundError(page);
      this.logError(err);
      return this.renderErrorToHTML(req, res, {
        err,
        ...options
      });
    }

    const template = this.getTemplate();

    try {
      const html = await renderToHTML(req, res, {
        page,
        component,
        template,
        ...options,
        ...parsedUrl
      });
      return html;
    } catch (err) {
      this.logError(err);
      res.statusCode = 500;
      return this.renderErrorToHTML(req, res, {
        err,
        ...options
      });
    }
  }

  async renderErrorToHTML(req, res, options = {}) {
    const component = this.getComponent('_error') || ErrorComponent;
    const template = this.getComponent('_error');

    const html = await renderToHTML(req, res, {
      page: '_error',
      ...options,
      component,
      template,
    });

    return html;
  }

  getTemplate(page) {
    if (page && this.pages && this.pages[page] && this.pages[page].template) {
      return this.pages[page].template;
    }
    return this.template;
  }

  getComponent(page) {
    if (this.pages && this.pages[page] && this.pages[page].component) {
      return this.pages[page].component;
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
    template,
    component,
    pathname,
    query,
    err
  } = options;

  const ctx = { req, res, pathname, query, err };

  const pageProps = await getInitialProps(component, { ctx });
  const pageElement = createElement(component, pageProps);
  const pageContent = renderer.renderToString(pageElement, {
    remRatio: 100
  });

  if (!template) {
    return pageContent;
  }

  const templateProps = await getInitialProps(template, { ctx });
  const templateElement = createElement(template, {
    pageContent,
    pageProps: JSON.stringify(pageProps),
    templateProps
  });

  const html = '<!doctype html>' + renderer.renderToString(templateElement);

  return html;
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