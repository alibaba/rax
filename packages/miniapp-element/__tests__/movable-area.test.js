const _ = require('./utils');

test('movable-area', async() => {
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
  node.setAttribute('behavior', 'movable-area');
  page.document.body.appendChild(node);
  const child = page.document.createElement('wx-component');
  child.setAttribute('behavior', 'movable-view');
  node.appendChild(child);
  await _.sleep(10);
  const movableArea = body.querySelector('.h5-wx-component');

  /**
     * movable-view
     */

  const proxy = new Proxy({}, {
    get(target, name) {
      return movableArea.data.innerChildNodes[0].extra[name];
    },
  });

  // direction
  await _.checkString({data: proxy}, child, 'direction', 'direction', 'none');

  // inertia
  await _.checkBoolean({data: proxy}, child, 'inertia', 'inertia', false);

  // out-of-bounds
  await _.checkBoolean({data: proxy}, child, 'outOfBounds', 'out-of-bounds', false);

  // x
  await _.checkNumber({data: proxy}, child, 'x', 'x', 0);

  // y
  await _.checkNumber({data: proxy}, child, 'y', 'y', 0);

  // damping
  await _.checkNumber({data: proxy}, child, 'damping', 'damping', 20);

  // friction
  await _.checkNumber({data: proxy}, child, 'friction', 'friction', 2);

  // disabled
  await _.checkBoolean({data: proxy}, child, 'disabled', 'disabled', false);

  // scale
  await _.checkBoolean({data: proxy}, child, 'scale', 'scale', false);

  // scale-min
  await _.checkNumber({data: proxy}, child, 'scaleMin', 'scale-min', 0.5);

  // scale-max
  await _.checkNumber({data: proxy}, child, 'scaleMax', 'scale-max', 10);

  // scale-value
  await _.checkNumber({data: proxy}, child, 'scaleValue', 'scale-value', 1);

  // animation
  await _.checkBoolean({data: proxy}, child, 'animation', 'animation', true);

  /**
     * movable-area
     */

  // scale-area
  await _.checkBoolean(movableArea, node, 'scaleArea', 'scale-area', false);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
