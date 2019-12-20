const _ = require('./utils');

test('button', async() => {
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
  node.setAttribute('behavior', 'button');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const button = body.querySelector('.h5-wx-component');

  // size
  await _.checkString(button, node, 'size', 'size', 'default');

  // type
  await _.checkString(button, node, 'type', 'type', 'default');

  // plain
  await _.checkBoolean(button, node, 'plain', 'plain', false);

  // disabled
  await _.checkBoolean(button, node, 'disabled', 'disabled', false);

  // loading
  await _.checkBoolean(button, node, 'loading', 'loading', false);

  // formType
  await _.checkString(button, node, 'formType', 'form-type', '');

  // openType
  await _.checkString(button, node, 'openType', 'open-type', '');

  // hoverClass
  await _.checkString(button, node, 'hoverClass', 'hover-class', 'button-hover');

  // hoverStopPropagation
  await _.checkBoolean(button, node, 'hoverStopPropagation', 'hover-stop-propagation', false);

  // hoverStartTime
  await _.checkNumber(button, node, 'hoverStartTime', 'hover-start-time', 20);

  // hoverStayTime
  await _.checkNumber(button, node, 'hoverStayTime', 'hover-stay-time', 70);

  // lang
  await _.checkString(button, node, 'lang', 'lang', 'en');

  // sessionFrom
  await _.checkString(button, node, 'sessionFrom', 'session-from', '');

  // sendMessageTitle
  await _.checkString(button, node, 'sendMessageTitle', 'send-message-title', '');

  // sendMessagePath
  await _.checkString(button, node, 'sendMessagePath', 'send-message-path', '');

  // sendMessageImg
  await _.checkString(button, node, 'sendMessageImg', 'send-message-img', '');

  // appParameter
  await _.checkString(button, node, 'appParameter', 'app-parameter', '');

  // showMessageCard
  await _.checkBoolean(button, node, 'showMessageCard', 'show-message-card', false);

  // businessId
  await _.checkString(button, node, 'businessId', 'business-id', '');

  // event
  const wxButton = button.querySelector('.wx-comp-button');
  await _.checkEvent(wxButton, node, ['getuserinfo', 'contact', 'getphonenumber', 'error', 'opensetting', 'launchapp']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
