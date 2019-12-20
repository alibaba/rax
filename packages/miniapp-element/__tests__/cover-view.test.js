const _ = require('./utils');

test('cover-view', async() => {
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
  node.setAttribute('behavior', 'cover-view');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const coverView = body.querySelector('.h5-wx-component');

  // scrollTop
  expect(coverView.data.scrollTop).toBe('');
  node.setAttribute('scroll-top', 20);
  await _.sleep(10);
  expect(coverView.data.scrollTop).toBe(20);
  node.setAttribute('scroll-top', 0);
  await _.sleep(10);
  expect(coverView.data.scrollTop).toBe(0);
  node.setAttribute('scroll-top', '30');
  await _.sleep(10);
  expect(coverView.data.scrollTop).toBe(30);
  node.setAttribute('scroll-top', '0');
  await _.sleep(10);
  expect(coverView.data.scrollTop).toBe(0);
  node.setAttribute('scroll-top', 'abc');
  await _.sleep(10);
  expect(coverView.data.scrollTop).toBe('');
  node.setAttribute('scroll-top', undefined);
  await _.sleep(10);
  expect(coverView.data.scrollTop).toBe('');

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
