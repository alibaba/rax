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
  node.setAttribute('behavior', 'picker');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const picker = body.querySelector('.h5-wx-component');

  // mode
  await _.checkString(picker, node, 'mode', 'mode', 'selector');

  // disabled
  await _.checkBoolean(picker, node, 'disabled', 'disabled', false);

  // range
  await _.checkArray(picker, node, 'range', 'range', [], ['美国', '中国', '巴西', '日本']);

  // rangeKey
  await _.checkString(picker, node, 'rangeKey', 'range-key', '');

  // value
  node.setAttribute('mode', '');
  await _.sleep(10);
  await _.checkNumber(picker, node, 'value', 'value', 0);
  node.setAttribute('mode', 'selector');
  node.setAttribute('value', undefined);
  await _.sleep(10);
  await _.checkNumber(picker, node, 'value', 'value', 0);
  node.setAttribute('mode', 'multiSelector');
  node.setAttribute('value', undefined);
  await _.sleep(10);
  await _.checkNumber(picker, node, 'value', 'value', 0);
  node.setAttribute('mode', 'time');
  node.setAttribute('value', undefined);
  await _.sleep(10);
  await _.checkString(picker, node, 'value', 'value', '');
  node.setAttribute('mode', 'date');
  node.setAttribute('value', undefined);
  await _.sleep(10);
  await _.checkString(picker, node, 'value', 'value', '0');
  node.setAttribute('mode', 'region');
  node.setAttribute('value', undefined);
  await _.sleep(10);
  expect(picker.data.value).toEqual([]);
  const value = ['广东省', '广州市', '海珠区'];
  node.setAttribute('value', value);
  await _.sleep(10);
  expect(picker.data.value).toEqual(value);
  node.setAttribute('value', []);
  await _.sleep(10);
  expect(picker.data.value).toEqual([]);
  node.setAttribute('value', undefined);
  await _.sleep(10);
  expect(picker.data.value).toEqual([]);

  // start
  await _.checkString(picker, node, 'start', 'start', '');

  // end
  await _.checkString(picker, node, 'end', 'end', '');

  // fields
  await _.checkString(picker, node, 'fields', 'fields', 'day');

  // event
  const wxPicker = picker.querySelector('.wx-comp-picker');
  await _.checkEvent(wxPicker, node, ['change', 'columnchange', 'cancel']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
