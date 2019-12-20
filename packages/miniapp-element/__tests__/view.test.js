const _ = require('./utils');

test('view', async() => {
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
  node.setAttribute('behavior', 'view');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const view = body.querySelector('.h5-wx-component');

  // hoverClass
  await _.checkString(view, node, 'hoverClass', 'hover-class', 'none');

  // hoverStopPropagation
  await _.checkBoolean(view, node, 'hoverStopPropagation', 'hover-stop-propagation', false);

  // hoverStartTime
  await _.checkNumber(view, node, 'hoverStartTime', 'hover-start-time', 50);

  // hoverStayTime
  await _.checkNumber(view, node, 'hoverStayTime', 'hover-stay-time', 400);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
