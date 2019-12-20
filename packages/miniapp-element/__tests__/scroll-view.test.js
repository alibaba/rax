const _ = require('./utils');

test('scroll-view', async() => {
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
  node.setAttribute('behavior', 'scroll-view');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const scrollView = body.querySelector('.h5-wx-component');

  // scrollX
  await _.checkBoolean(scrollView, node, 'scrollX', 'scroll-x', false);

  // scrollY
  await _.checkBoolean(scrollView, node, 'scrollY', 'scroll-y', false);

  // upperThreshold
  await _.checkNumber(scrollView, node, 'upperThreshold', 'upper-threshold', 50);

  // lowerThreshold
  await _.checkNumber(scrollView, node, 'lowerThreshold', 'lower-threshold', 50);

  // scrollTop
  await _.checkNumber(scrollView, node, 'scrollTop', 'scroll-top', '');

  // scrollLeft
  await _.checkNumber(scrollView, node, 'scrollLeft', 'scroll-left', '');

  // scrollIntoView
  await _.checkString(scrollView, node, 'scrollIntoView', 'scroll-into-view', '');

  // scrollWithAnimation
  await _.checkBoolean(scrollView, node, 'scrollWithAnimation', 'scroll-with-animation', false);

  // enableBackToTop
  await _.checkBoolean(scrollView, node, 'enableBackToTop', 'enable-back-to-top', false);

  // enableFlex
  await _.checkBoolean(scrollView, node, 'enableFlex', 'enable-flex', false);

  // event
  const wxScrollView = scrollView.querySelector('.wx-comp-scroll-view');
  await _.checkEvent(wxScrollView, node, ['scrolltoupper', 'scrolltolower']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
