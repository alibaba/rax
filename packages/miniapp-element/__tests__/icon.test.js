const _ = require('./utils');

test('picker', async() => {
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
  node.setAttribute('behavior', 'icon');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const icon = body.querySelector('.h5-wx-component');

  // type
  await _.checkString(icon, node, 'type', 'type', '');

  // size
  await _.checkString(icon, node, 'size', 'size', '23');

  // color
  await _.checkString(icon, node, 'color', 'color', '');

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
