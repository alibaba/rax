const _ = require('./utils');

test('live-pusher', async() => {
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
  node.setAttribute('behavior', 'live-pusher');
  page.document.body.appendChild(node);
  await _.sleep(10);
  const livePusher = body.querySelector('.h5-wx-component');

  // url
  await _.checkUrl(livePusher, node, 'url', 'url', '');

  // mode
  await _.checkString(livePusher, node, 'mode', 'mode', 'RTC');

  // autopush
  await _.checkBoolean(livePusher, node, 'autopush', 'autopush', false);

  // muted
  await _.checkBoolean(livePusher, node, 'muted', 'muted', false);

  // enableCamera
  await _.checkBoolean(livePusher, node, 'enableCamera', 'enable-camera', true);

  // autoFocus
  await _.checkBoolean(livePusher, node, 'autoFocus', 'auto-focus', true);

  // orientation
  await _.checkString(livePusher, node, 'orientation', 'orientation', 'vertical');

  // beauty
  await _.checkNumber(livePusher, node, 'beauty', 'beauty', 0);

  // whiteness
  await _.checkNumber(livePusher, node, 'whiteness', 'whiteness', 0);

  // aspect
  await _.checkString(livePusher, node, 'aspect', 'aspect', '9:16');

  // minBitrate
  await _.checkNumber(livePusher, node, 'minBitrate', 'min-bitrate', 200);

  // maxBitrate
  await _.checkNumber(livePusher, node, 'maxBitrate', 'max-bitrate', 1000);

  // waitingImage
  await _.checkString(livePusher, node, 'waitingImage', 'waiting-image', '');

  // waitingImageHash
  await _.checkString(livePusher, node, 'waitingImageHash', 'waiting-image-hash', '');

  // zoom
  await _.checkBoolean(livePusher, node, 'zoom', 'zoom', false);

  // devicePosition
  await _.checkString(livePusher, node, 'devicePosition', 'device-position', 'front');

  // backgroundMute
  await _.checkBoolean(livePusher, node, 'backgroundMute', 'background-mute', false);

  // mirror
  await _.checkBoolean(livePusher, node, 'mirror', 'mirror', false);

  // event
  const wxLivePusher = livePusher.querySelector('.wx-comp-live-pusher');
  await _.checkEvent(wxLivePusher, node, ['statechange', 'netstatus', 'error', 'bgmstart', 'bgmprogress', 'bgmcomplete']);

  page.document.body.removeChild(node);
  document.body.removeChild(wrapper);
});
