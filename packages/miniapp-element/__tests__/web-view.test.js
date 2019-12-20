const _ = require('./utils');

test('web-view', async() => {
  const page = global.$$page;
  const componentId = _.load({
    template: `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`,
    usingComponents: {
      element: _.elementId,
    },
  }, 'page');
  const component = _.render(componentId);

  const wrapper = document.createElement('wrapper');
  document.body.appendChild(wrapper);
  component.attach(wrapper);
  expect(_.match(component.dom, `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`)).toBe(true);

  const body = component.querySelector('.h5-body');
  const node = page.document.createElement('wx-component');
  node.setAttribute('behavior', 'web-view');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const webView = body.querySelector('.h5-wx-component');

  // src
  await _.checkUrl(webView, node, 'src', 'src', '');

  // event
  const wxWebView = webView.querySelector('.wx-comp-web-view');
  await _.checkEvent(wxWebView, node, ['message', 'load', 'error']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
