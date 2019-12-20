const _ = require('./utils');

test('editor', async() => {
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
  node.setAttribute('behavior', 'editor');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const editor = body.querySelector('.h5-wx-component');

  // readOnly
  await _.checkBoolean(editor, node, 'readOnly', 'read-only', false);

  // placeholder
  await _.checkString(editor, node, 'placeholder', 'placeholder', '');

  // showImgSize
  await _.checkBoolean(editor, node, 'showImgSize', 'show-img-size', false);

  // showImgToolbar
  await _.checkBoolean(editor, node, 'showImgToolbar', 'show-img-toolbar', false);

  // showImgResize
  await _.checkBoolean(editor, node, 'showImgResize', 'show-img-resize', false);

  // event
  const wxEditor = editor.querySelector('.wx-comp-editor');
  await _.checkEvent(wxEditor, node, ['ready', 'focus', 'blur', 'input', 'statuschange']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
