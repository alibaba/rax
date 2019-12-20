const _ = require('./utils');

test('slider', async() => {
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
  node.setAttribute('behavior', 'slider');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const slider = body.querySelector('.h5-wx-component');

  // min
  await _.checkNumber(slider, node, 'min', 'min', 0);

  // max
  await _.checkNumber(slider, node, 'max', 'max', 100);

  // step
  await _.checkNumber(slider, node, 'step', 'step', 1);

  // disabled
  await _.checkBoolean(slider, node, 'disabled', 'disabled', false);

  // value
  await _.checkNumber(slider, node, 'value', 'value', 0);

  // color
  await _.checkString(slider, node, 'color', 'color', '#e9e9e9');

  // selectedColor
  await _.checkString(slider, node, 'selectedColor', 'selected-color', '#1aad19');

  // activeColor
  await _.checkString(slider, node, 'activeColor', 'active-color', '#1aad19');

  // backgroundColor
  await _.checkString(slider, node, 'backgroundColor', 'background-color', '#e9e9e9');

  // blockSize
  await _.checkNumber(slider, node, 'blockSize', 'block-size', 28);

  // blockColor
  await _.checkString(slider, node, 'blockColor', 'block-color', '#ffffff');

  // showValue
  await _.checkBoolean(slider, node, 'showValue', 'show-value', false);

  // event
  const wxSlider = slider.querySelector('.wx-comp-slider');
  await _.checkEvent(wxSlider, node, ['change', 'changing']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
