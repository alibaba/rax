const _ = require('./utils');

test('form', async() => {
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
  node.setAttribute('behavior', 'form');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const form = body.querySelector('.h5-wx-component');

  // reportSubmit
  await _.checkBoolean(form, node, 'reportSubmit', 'report-submit', false);

  // reportSubmitTimeout
  await _.checkNumber(form, node, 'reportSubmitTimeout', 'report-submit-timeout', 0);

  // event
  const wxForm = form.querySelector('.wx-comp-form');
  await _.checkEvent(wxForm, node, ['submit', 'reset']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
