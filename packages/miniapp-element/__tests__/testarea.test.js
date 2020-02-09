const _ = require('./utils');

test('textarea', async() => {
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
  const node = page.document.createElement('textarea');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const textarea = body.querySelector('.h5-textarea');

  // value
  await _.checkString(textarea, node, 'value', 'value', '');

  // placeholder
  await _.checkString(textarea, node, 'placeholder', 'placeholder', '');

  // placeholderStyle
  await _.checkString(textarea, node, 'placeholderStyle', 'placeholder-style', '');

  // placeholderClass
  await _.checkString(textarea, node, 'placeholderClass', 'placeholder-class', 'input-placeholder');

  // disabled
  await _.checkBoolean(textarea, node, 'disabled', 'disabled', false);

  // maxlength
  await _.checkNumber(textarea, node, 'maxlength', 'maxlength', 140);

  // autoFocus
  await _.checkBoolean(textarea, node, 'autoFocus', 'autofocus', false);

  // focus
  await _.checkBoolean(textarea, node, 'focus', 'focus', false);
  node.focus();
  await _.sleep(10);
  expect(textarea.data.focus).toBe(true);
  node.blur();
  await _.sleep(10);
  expect(textarea.data.focus).toBe(false);

  // autoHeight
  await _.checkBoolean(textarea, node, 'autoHeight', 'auto-height', false);

  // fixed
  await _.checkBoolean(textarea, node, 'fixed', 'fixed', false);

  // cursorSpacing
  await _.checkNumber(textarea, node, 'cursorSpacing', 'cursor-spacing', 0);

  // cursor
  await _.checkNumber(textarea, node, 'cursor', 'cursor', -1);

  // showConfirmBar
  await _.checkBoolean(textarea, node, 'showConfirmBar', 'show-confirm-bar', true);

  // selectionStart
  await _.checkNumber(textarea, node, 'selectionStart', 'selection-start', -1);

  // selectionEnd
  await _.checkNumber(textarea, node, 'selectionEnd', 'selection-end', -1);

  // adjustPosition
  await _.checkBoolean(textarea, node, 'adjustPosition', 'adjust-position', true);

  // event
  const wxTextarea = textarea.querySelector('.wx-comp-textarea');
  await _.checkEvent(wxTextarea, node, ['focus', 'blur', 'linechange', 'input', 'confirm', 'keyboardheightchange']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
