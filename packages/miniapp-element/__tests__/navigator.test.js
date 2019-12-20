const _ = require('./utils');

test('navigator', async() => {
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
  node.setAttribute('behavior', 'navigator');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const navigator = body.querySelector('.h5-wx-component');

  // target
  await _.checkString(navigator, node, 'target', 'target', 'self');

  // url
  await _.checkString(navigator, node, 'url', 'url', '');

  // openType
  await _.checkString(navigator, node, 'openType', 'open-type', 'navigate');

  // delta
  await _.checkNumber(navigator, node, 'delta', 'delta', 1);

  // appId
  await _.checkString(navigator, node, 'appId', 'app-id', '');

  // path
  await _.checkString(navigator, node, 'path', 'path', '');

  // extraData
  expect(navigator.data.extraData).toEqual({});
  node.setAttribute('extra-data', {a: 123, b: 321});
  await _.sleep(10);
  expect(navigator.data.extraData).toEqual({a: 123, b: 321});
  node.setAttribute('extra-data', undefined);
  await _.sleep(10);
  expect(navigator.data.extraData).toEqual({});

  // version
  await _.checkString(navigator, node, 'version', 'version', 'release');

  // hoverClass
  await _.checkString(navigator, node, 'hoverClass', 'hover-class', 'navigator-hover');

  // hoverStopPropagation
  await _.checkBoolean(navigator, node, 'hoverStopPropagation', 'hover-stop-propagation', false);

  // hoverStartTime
  await _.checkNumber(navigator, node, 'hoverStartTime', 'hover-start-time', 50);

  // hoverStayTime
  await _.checkNumber(navigator, node, 'hoverStayTime', 'hover-stay-time', 600);

  // event
  const wxNavigator = navigator.querySelector('.wx-comp-navigator');
  await _.checkEvent(wxNavigator, node, ['success', 'fail', 'complete']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
