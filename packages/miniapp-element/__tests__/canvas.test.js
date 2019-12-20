const _ = require('./utils');

test('canvas', async() => {
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
  const node = page.document.createElement('canvas');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const canvas = body.querySelector('.h5-canvas');

  // type
  await _.checkString(canvas, node, 'type', 'type', '');

  // canvasId
  await _.checkString(canvas, node, 'canvasId', 'canvas-id', '');

  // disableScroll
  await _.checkBoolean(canvas, node, 'disableScroll', 'disable-scroll', false);

  // event
  const wxCanvas = canvas.querySelector('.wx-comp-canvas');
  await _.checkEvent(wxCanvas, node, ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'longtap', 'error']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
