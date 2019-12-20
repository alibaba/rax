const _ = require('./utils');

test('picker-view', async() => {
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
  node.setAttribute('behavior', 'picker-view');
  node.innerHTML = `
        <wx-picker-view-column><span>1</span></wx-picker-view-column>
        <wx-picker-view-column><span>2</span></wx-picker-view-column>
        <wx-picker-view-column><span>3</span></wx-picker-view-column>
        <div>123</div>
    `;
  page.document.body.appendChild(node);
  await _.sleep(10);
  const pickerView = body.querySelector('.h5-wx-component');

  // 检查 picker-view-column
  expect(pickerView.dom.childNodes[0].childNodes.length).toBe(3);
  expect(pickerView.dom.childNodes[0].childNodes[0].childNodes[0].classList.contains('element--h5-span')).toBe(true);
  expect(pickerView.dom.childNodes[0].childNodes[0].childNodes[0].innerHTML).toBe('1');
  expect(pickerView.dom.childNodes[0].childNodes[1].childNodes[0].classList.contains('element--h5-span')).toBe(true);
  expect(pickerView.dom.childNodes[0].childNodes[1].childNodes[0].innerHTML).toBe('2');
  expect(pickerView.dom.childNodes[0].childNodes[2].childNodes[0].classList.contains('element--h5-span')).toBe(true);
  expect(pickerView.dom.childNodes[0].childNodes[2].childNodes[0].innerHTML).toBe('3');
  expect(pickerView.data.innerChildNodes[0].extra).toEqual({hidden: false});
  expect(pickerView.data.innerChildNodes[1].extra).toEqual({hidden: false});
  expect(pickerView.data.innerChildNodes[2].extra).toEqual({hidden: false});

  // value
  await _.checkArray(pickerView, node, 'value', 'value', [], [9999, 1, 1]);

  // indicator-style
  await _.checkString(pickerView, node, 'indicatorStyle', 'indicator-style', '');

  // indicator-class
  await _.checkString(pickerView, node, 'indicatorClass', 'indicator-class', '');

  // mask-style
  await _.checkString(pickerView, node, 'maskStyle', 'mask-style', '');

  // mask-class
  await _.checkString(pickerView, node, 'maskClass', 'mask-class', '');

  // event
  const wxPickerView = pickerView.querySelector('.wx-comp-picker-view');
  await _.checkEvent(wxPickerView, node, ['change', 'pickstart', 'pickend']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
