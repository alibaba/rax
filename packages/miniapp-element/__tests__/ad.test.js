const _ = require('./utils');

test('ad', async() => {
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
  node.setAttribute('behavior', 'ad');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const ad = body.querySelector('.h5-wx-component');

  // unitId
  await _.checkString(ad, node, 'unitId', 'unit-id', '');

  // adIntervals
  await _.checkNumber(ad, node, 'adIntervals', 'ad-intervals', 0);

  // event
  const wxAd = ad.querySelector('.wx-comp-ad');
  await _.checkEvent(wxAd, node, ['load', 'error', 'close']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
