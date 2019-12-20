const _ = require('./utils');

test('progress', async() => {
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
  node.setAttribute('behavior', 'progress');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const progress = body.querySelector('.h5-wx-component');

  // percent
  await _.checkNumber(progress, node, 'percent', 'percent', 0);

  // showInfo
  await _.checkBoolean(progress, node, 'showInfo', 'show-info', false);

  // borderRadius
  await _.checkString(progress, node, 'borderRadius', 'border-radius', '0');

  // fontSize
  await _.checkString(progress, node, 'fontSize', 'font-size', '16');

  // strokeWidth
  await _.checkString(progress, node, 'strokeWidth', 'stroke-width', '6');

  // color
  await _.checkString(progress, node, 'color', 'color', '#09BB07');

  // activeColor
  await _.checkString(progress, node, 'activeColor', 'active-color', '#09BB07');

  // backgroundColor
  await _.checkString(progress, node, 'backgroundColor', 'background-color', '#EBEBEB');

  // active
  await _.checkBoolean(progress, node, 'active', 'active', false);

  // activeMode
  await _.checkString(progress, node, 'activeMode', 'active-mode', 'backwards');

  // event
  const wxProgress = progress.querySelector('.wx-comp-progress');
  await _.checkEvent(wxProgress, node, ['activeend']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
